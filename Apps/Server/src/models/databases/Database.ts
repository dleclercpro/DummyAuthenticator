import { Logger } from 'pino';
import { Auth } from '../../types';
import { logger } from '../../utils/logger';

export interface IKeyValueDatabase<R> {
    has(id: string): Promise<boolean>;
    get(id: string): Promise<R | null>;
    set(id: string, record: R): Promise<void>;
    delete(id: string): Promise<void>;
}

export interface DatabaseOptions {
    host: string,
    port: number,
    name: string,
    auth?: Auth,
}



abstract class Database {
    protected host: string;
    protected port: number;
    protected name: string;
    protected auth?: Auth;

    protected logger: Logger;

    protected abstract getURI(): string;
    protected abstract getAnonymousURI(): string;

    public constructor(options: DatabaseOptions) {
        const { host, port, name, auth } = options;

        this.host = host;
        this.port = port;
        this.name = name;
        this.auth = auth;

        this.logger = logger;
    }

    public async start() {

    }

    public async stop() {
        
    }
}

export default Database;