import { RedisClientType, createClient } from 'redis';
import Database, { DatabaseOptions } from './Database';
import { IKeyValueDatabase } from './MemoryDatabase';
import { TimeUnit } from '../../types/TimeTypes';
import { Logger } from 'pino';
import { REDIS_DB_RETRY_CONNECT_MAX, REDIS_DB_RETRY_CONNECT_MAX_DELAY } from '../../config/DatabasesConfig';
import TimeDuration from '../units/TimeDuration';
import { Listener, createObserver } from '../Observer';

interface SetEvent<V> {
    prevValue: V | null,
    value: V,
}

interface DeleteEvent<V> {
    prevValue: V | null,
}

class RedisDatabase extends Database implements IKeyValueDatabase<string> {
    private client: RedisClientType;

    protected onSetObserver = createObserver<SetEvent<string>>();
    protected onDeleteObserver = createObserver<DeleteEvent<string>>();
    
    public constructor(options: DatabaseOptions, customLogger?: Logger) {
        super(options, customLogger);

        // Instanciate Redis client
        this.client = createClient({
            url: this.getURI(),
            socket: {
                reconnectStrategy: this.retry,
            },
        });
    }

    protected getURI = () => {
        const uri = this.getAnonymousURI();

        if (this.auth) {
            const { user, pass } = this.auth;

            return `redis://${user}:${pass}@${uri}`;
        }

        return `redis://${uri}`;
    }

    protected getAnonymousURI = () => {
        let uri = `${this.host}:${this.port}`;

        if (this.name) {
            uri = `${uri}/${this.name}`;
        }

        return uri;
    }

    public async start() {

        // Listen to events it emits
        this.listen();

        // Connect to database
        await this.client.connect();
    }

    public async stop() {
        await this.client.quit();
    }

    protected listen = () => {
        this.client.on('ready', () => {
            this.logger.debug('[Redis] Ready.');
        });

        this.client.on('connect', () => {
            this.logger.debug('[Redis] Connected.');
        });

        this.client.on('reconnecting', () => {
            this.logger.debug('[Redis] Reconnecting...');
        });

        this.client.on('end', () => {
            this.logger.debug('[Redis] Disconnected.');
        });

        this.client.on('warning', (warning: any) => {
            this.logger.warn(warning.message);
        });

        this.client.on('error', (error: any) => {
            this.logger.error(error.message);
        });
    }

    protected retry = (retries: number, error: any) => {

        // End reconnecting on a specific error and flush all commands with
        // a individual error
        if (error && error.code === 'ECONNREFUSED') {
            return new Error('[Redis] The server refused the connection.');
        }
        
        // End reconnecting with built in error
        if (retries > REDIS_DB_RETRY_CONNECT_MAX) {
            return new Error('[Redis] Number of connection retries exhausted. Stopping connection attempts.');
        }

        // Reconnect after ... ms
        const wait = Math.min(
            new TimeDuration(retries + 0.5, TimeUnit.Second).toMs().getAmount(),
            REDIS_DB_RETRY_CONNECT_MAX_DELAY.toMs().getAmount(),
        );
        this.logger.debug(`Waiting ${wait} ms...`);

        return wait;
    }

    private getPrefixedKey(key: string) {
        return this.name ? `${this.name}:${key}` : key;
    }

    public async has(key: string) {
        return this.get(key) !== null;
    }

    public async get(key: string) {
        return this.client.get(this.getPrefixedKey(key));
    }

    public async getAllKeys() {
        return this.client.keys(this.getPrefixedKey('*'));
    }

    public async getAll() {
        const keys = await this.getAllKeys();
        const values = await Promise.all(keys.map((key) => this.client.get(key)));

        return values;
    }

    public async set(key: string, value: string) {
        const prefixedKey = this.getPrefixedKey(key);
        const prevValue = await this.client.get(prefixedKey);

        await this.client.set(prefixedKey, value);

        this.onSetObserver.publish({ prevValue, value });
    }

    public async delete(key: string) {
        const prefixedKey = this.getPrefixedKey(key);
        const prevValue = await this.client.get(prefixedKey);
        
        if (prevValue) {
            await this.client.del(prefixedKey);

            this.onDeleteObserver.publish({ prevValue });
        }
    }

    public onSet(listener: Listener<SetEvent<string>>) {
        return this.onSetObserver.subscribe(listener);
    }

    public onDelete(listener: Listener<DeleteEvent<string>>) {
        return this.onDeleteObserver.subscribe(listener);
    }
}

export default RedisDatabase;