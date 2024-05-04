import { RedisClientType, createClient } from 'redis';
import Database, { DatabaseOptions, IKeyValueDatabase } from './Database';
import { logger } from '../../utils/logger';
import TimeDuration from '../units/TimeDuration';
import { TimeUnit } from '../../types/TimeTypes';
import { REDIS_RETRY_CONN_MAX_ATTEMPTS, REDIS_RETRY_CONN_MAX_BACKOFF } from '../../config/DatabasesConfig';

class RedisDatabase extends Database implements IKeyValueDatabase<string> {
    private index: number; // Database index
    private client: RedisClientType;
    
    public constructor(options: DatabaseOptions, index: number = 0) {
        super(options);

        if (index < 0 || index > 15) {
            throw new Error('INVALID_REDIS_DATABASE_INDEX');
        }
        this.index = index;

        this.client = createClient({
            url: this.getURI(),
            database: index,
            socket: {
                reconnectStrategy: this.connect,
            },
        });
    }

    protected getURI = () => {
        let uri = this.getAnonymousURI();

        if (this.auth) {
            const { user, pass } = this.auth;

            uri = uri.replace('[USER]', encodeURIComponent(user));
            uri = uri.replace('[PASS]', encodeURIComponent(pass));
        }

        return uri;
    }

    protected getAnonymousURI = () => {
        const uri = `${this.host}:${this.port}`;

        if (this.auth) {
            return `redis://[USER]:[PASS]@${uri}`;
        }

        return `redis://${uri}`;
    }

    public async start() {
        logger.debug(`Starting Redis database '${this.index}'.`);

        this.listen();

        logger.debug(`Trying to connect to: ${this.getAnonymousURI()}`);

        await this.client.connect();
    }

    public async stop() {
        await this.client.quit();
    }

    protected listen = () => {
        this.client.on('ready', () => {
            logger.trace('Ready.');
        });

        this.client.on('connect', () => {
            logger.trace('Connected.');
        });

        this.client.on('reconnecting', () => {
            logger.trace('Reconnecting...');
        });

        this.client.on('end', () => {
            logger.trace('Disconnected.');
        });

        this.client.on('warning', (warning: any) => {
            logger.trace(`Warning: ${warning}`);
        });

        this.client.on('error', (error: any) => {
            logger.trace(`Error: ${error.message}`);

            // Log whenever a database connection is refused
            if (error && error.code === 'ECONNREFUSED') {
                logger.error('Redis refused connection. Is it running?');
            }
        });
    }

    protected connect = (attempts: number, error: any) => {
        if (attempts >= REDIS_RETRY_CONN_MAX_ATTEMPTS) {
            logger.fatal('No more connection attempts allowed: exiting...')
            process.exit(1);
        }

        // First connection attempt: do not wait
        if (attempts === 0) {
            return 0;
        }

        // Reconnect after backing off
        const wait = this.getConnectionBackoff(attempts);
        logger.debug(`Connection attempts left: ${REDIS_RETRY_CONN_MAX_ATTEMPTS - attempts}`);
        logger.debug(`Retrying connection in: ${wait.format()}`);

        return wait.toMs().getAmount();
    }

    private getConnectionBackoff(attempts: number) {
        const maxBackoff = REDIS_RETRY_CONN_MAX_BACKOFF;
        const exponentialBackoff = new TimeDuration(Math.pow(2, attempts), TimeUnit.Second);

        // Backoff exponentially
        if (exponentialBackoff.smallerThan(maxBackoff)) {
            return exponentialBackoff;
        }
        return maxBackoff;
    }

    private getPrefixedKey(key: string) {
        return this.name ? `${this.name}:${key}` : key;
    }

    public async has(key: string) {
        return await this.get(key) !== null;
    }

    public async get(key: string) {
        return await this.client.get(this.getPrefixedKey(key));
    }

    public async getAllKeys() {
        return await this.client.keys(this.getPrefixedKey('*'));
    }

    public async getAll() {
        const keys = await this.getAllKeys();
        const values = await Promise.all(keys.map((key) => this.client.get(key)));

        return values;
    }

    public async getKeysByPattern(pattern: string) {
        let cursor = 0;
        let keys: string[] = [];

        do {
            const reply = await this.client.scan(cursor, {
                MATCH: this.getPrefixedKey(pattern),
                COUNT: 100,
            });

            cursor = reply.cursor;
            keys.push(...reply.keys);

          } while (cursor !== 0);
    
        return keys;
    }

    public async set(key: string, value: string) {
        const prefixedKey = this.getPrefixedKey(key);

        await this.client.set(prefixedKey, value);
    }

    public async delete(key: string) {
        const prefixedKey = this.getPrefixedKey(key);
        const prevValue = await this.client.get(prefixedKey);
        
        if (prevValue) {
            await this.client.del(prefixedKey);
        }
    }

    public async deleteAllKeys() {
        logger.debug(`Flushing Redis database '${this.index}'.`);
        await this.client.flushDb();
    }
}

export default RedisDatabase;