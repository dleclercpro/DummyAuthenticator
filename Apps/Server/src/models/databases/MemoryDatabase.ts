import { logger } from '../../utils/logger';
import { IKeyValueDatabase } from './Database';

class MemoryDatabase<R> implements IKeyValueDatabase<R> {
    protected db = new Map<string, R>();

    public async start() {
        logger.info(`Using in-memory database.`);
    }

    public async stop() {

    }

    public async has(id: string) {
        return this.db.has(id);
    }

    public async get(id: string) {
        return this.db.get(id) ?? null;
    }

    public async set(id: string, value: R) {
        this.db.set(id, value);
    }

    public async delete(id: string) {
        const prevValue = this.db.get(id) ?? null;

        if (prevValue) {
            this.db.delete(id);
        }
    }

    public async size() {
        return this.db.size;
    }

    public async getAll() {
        return Array.from(this.db.values());
    }
}

export default MemoryDatabase;