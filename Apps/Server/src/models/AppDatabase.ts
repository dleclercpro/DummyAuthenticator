import { logger } from '../utils/logger';
import { ADMINS, USERS } from '../config/AuthConfig';
import User from './user/User';
import { REDIS_ENABLE, REDIS_OPTIONS, REDIS_DATABASE } from '../config/DatabasesConfig';
import MemoryDatabase from './databases/MemoryDatabase';
import RedisDatabase from './databases/RedisDatabase';
import Admin from './user/Admin';
import { Token } from '../types/TokenTypes';
import { LoginAttempt } from './user/UserLogin';
import { computeDate } from '../utils/time';
import TimeDuration from './units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';



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
            logger.trace(`Default admin user created: ${email}`);
        });

        // Create regular users if they don't already exist
        USERS.forEach(async ({ email, password }) => {
            const user = await User.findByEmail(email);
            
            if (user) {
                return;
            }

            await User.create(email, password, false);
            logger.trace(`Default regular user created: ${email}`);
        });

        // Remove login attempts older than a given amount of time (e.g. 1h)
        await this.removeOldLoginAttempts();

        // Remove expired tokens
        await this.removeExpiredTokens();
    }

    public async start() {
        if (!this.db) throw new Error('MISSING_DATABASE');

        await this.db.start();
    }

    public async stop() {
        if (!this.db) throw new Error('MISSING_DATABASE');

        await this.db.stop();
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

    public async getAllKeys() {
        return this.db.getAllKeys();
    }

    public async getAllValues() {
        return this.db.getAllValues();
    }

    public async getKeysByPattern(pattern: string) {
        const keys = await this.db.getKeysByPattern(pattern);

        if (!keys) {
            return [];
        }

        return keys;
    }

    protected async getAllUsers() {
        const userKeys = await this.getKeysByPattern('user:*');

        if (!userKeys) {
            return [];
        }

        const userStrings = await Promise.all(
            userKeys.map(async (key: string) => this.get(key))
        );

        const users = userStrings
            .filter((userString) => userString !== null)
            .map((userString) => User.deserialize(userString as string));

        return users;
    }

    protected async removeOldLoginAttempts(startingFrom: Date = new Date()) {
        const users = await this.getAllUsers();

        const oneHourAgo = computeDate(startingFrom, new TimeDuration(1, TimeUnit.Hour));

        return Promise.all(users.map(async (user: User) => {
            const recentAttempts = user.getLogin().getAttempts()
                .filter((attempt: LoginAttempt) => oneHourAgo <= new Date(attempt.timestamp));

            user.getLogin().setAttempts(recentAttempts);

            await user.save();
        }));
    }

    protected async removeExpiredTokens(startingFrom: Date = new Date()) {
        const users = await this.getAllUsers();

        return Promise.all(users.map(async (user: User) => {
            const nonExpiredTokens = user.getTokens()
                .filter((token: Token) => startingFrom < new Date(token.content.expirationDate));

            user.setTokens(nonExpiredTokens);

            await user.save();
        }));
    }
}

export default AppDatabase;