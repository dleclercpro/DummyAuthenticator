import crypto from 'crypto';
import { SESSION_DURATION } from '../../config/AuthConfig';
import { logger } from '../../utils/logger';
import { DB } from '../..';
import TimeDuration from '../units/TimeDuration';

interface SessionArgs {
    id: string, email: string, expiresAt: Date, staySignedIn: boolean,
}

class Session {
    protected id: string;
    protected email: string;
    protected expiresAt: Date;
    public staySignedIn: boolean;

    public constructor(args: SessionArgs) {
        this.id = args.id;
        this.email = args.email;
        this.expiresAt = args.expiresAt;
        this.staySignedIn = args.staySignedIn;
    }

    public serialize() {
        return JSON.stringify({
            id: this.id,
            email: this.email,
            expiresAt: this.expiresAt,
            staySignedIn: this.staySignedIn,
        });
    }

    public static deserialize(str: string) {
        const session = JSON.parse(str);
        return new Session({
            ...session,
            expiresAt: new Date(session.expiresAt),
        });
    }

    public stringify() {
        return this.getId();
    }

    public getId() {
        return this.id;
    }

    public getEmail() {
        return this.email;
    }

    public getExpiresAt() {
        return this.expiresAt;
    }

    public async extend(extensionTime: TimeDuration) {
        this.expiresAt = new Date(this.expiresAt.getTime() + extensionTime.toMs().getAmount());

        await this.save();

        logger.debug(`Extended session of user: ${this.email}`);
    }

    public async save() {
        DB.set(`session:${this.id}`, this.serialize());

        logger.debug(`Stored session of user: ${this.email}`);
    }

    public async delete() {
        DB.delete(`session:${this.id}`);

        logger.debug(`Deleted session of user: ${this.email}`);
    }

    // STATIC METHODS
    protected static generateId() {
        return crypto.randomUUID();
    }

    public static async findById(id: string) {
        const sessionAsString = await DB.get(`session:${id}`);

        if (sessionAsString) {
            return Session.deserialize(sessionAsString);
        }
    }

    public static async create(email: string, staySignedIn: boolean = false) {
        let id = '';

        // Find a unique, non-existent ID for the new session 
        while (!id || await Session.findById(id)) {
            id = Session.generateId();
        }

        // Generate default expiration date for session
        const expiresAt = new Date(new Date().getTime() + SESSION_DURATION.toMs().getAmount());

        // Create new session
        const session = new Session({ id, email, expiresAt, staySignedIn });

        // Store session in database
        await session.save();

        return session;
    }
}

export default Session;