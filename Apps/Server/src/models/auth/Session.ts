import crypto from 'crypto';
import { SESSION_DURATION } from '../../config/AuthConfig';
import { logger } from '../../utils/logger';
import { APP_DB } from '../..';
import TimeDuration from '../units/TimeDuration';
import User from './User';

interface SessionArgs {
    id: string, admin: boolean, email: string, expiresAt: Date, staySignedIn: boolean,
}

class Session {
    protected id: string;
    protected admin: boolean;
    protected email: string;
    protected expiresAt: Date;
    public staySignedIn: boolean;

    public constructor(args: SessionArgs) {
        this.id = args.id;
        this.admin = args.admin;
        this.email = args.email;
        this.expiresAt = args.expiresAt;
        this.staySignedIn = args.staySignedIn;
    }

    public serialize() {
        return JSON.stringify({
            id: this.id,
            admin: this.admin,
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

    public isAdmin() {
        return this.admin;
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

        logger.trace(`Extended session of user: ${this.email}`);
    }

    public async save() {
        APP_DB.set(`session:${this.id}`, this.serialize());

        logger.trace(`Stored session of user: ${this.email}`);
    }

    public async delete() {
        APP_DB.delete(`session:${this.id}`);

        logger.trace(`Deleted session of user: ${this.email}`);
    }

    // STATIC METHODS
    protected static generateId() {
        return crypto.randomUUID();
    }

    public static async findById(id: string) {
        const sessionAsString = await APP_DB.get(`session:${id}`);

        if (sessionAsString) {
            return Session.deserialize(sessionAsString);
        }
    }

    public static async create(user: User, staySignedIn: boolean = false) {
        let id = '';

        // Find a unique, non-existent ID for the new session 
        while (!id || await Session.findById(id)) {
            id = Session.generateId();
        }

        // Generate default expiration date for session
        const expiresAt = new Date(new Date().getTime() + SESSION_DURATION.toMs().getAmount());

        // Create new session
        const session = new Session({ id, admin: user.isAdmin(), email: user.getEmail().getValue(), expiresAt, staySignedIn });

        // Store session in database
        await session.save();

        return session;
    }
}

export default Session;