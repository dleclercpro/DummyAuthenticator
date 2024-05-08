import { logger } from '../utils/logger';
import { ADMINS } from '../config/AuthConfig';
import User from './auth/User';
import { REDIS_ENABLE, REDIS_OPTIONS, REDIS_DATABASE } from '../config/DatabasesConfig';
import MemoryDatabase from './databases/MemoryDatabase';
import RedisDatabase from './databases/RedisDatabase';
import Admin from './auth/Admin';



// There can only be one app database: singleton!
class AppDatabase {
    private db: RedisDatabase | MemoryDatabase<string>;

    public constructor() {
        this.db = (REDIS_ENABLE ?
            new RedisDatabase(REDIS_OPTIONS, REDIS_DATABASE) :
            new MemoryDatabase<string>() // Fallback database: in-memory
        );
    }

    public async setup() {

        // Create admin users if they don't already exist
        ADMINS.forEach(async ({ email, password }) => {
            const admin = await User.findByEmail(email);
            
            if (admin) {
                return;
            }

            await Admin.create(email, password);
            logger.debug(`Default admin user created: ${email}`);
        });
    }

    public async start() {
        if (!this.db) throw new Error('MISSING_DATABASE');

        await this.db.start();
    }

    public async stop() {
        if (!this.db) throw new Error('MISSING_DATABASE');
    }

    public async has(key: string) {
        return this.db.has(key);
    }

    public async get(key: string) {
        return this.db.get(key);
    }

    public async set(key: string, value: string) {
        return this.db.set(key, value);
    }

    public async delete(key: string) {
        return this.db.delete(key);
    }

    public async flush() {
        return this.db.flush();
    }
}

export default AppDatabase;