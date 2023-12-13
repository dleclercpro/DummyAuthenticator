import crypto from 'crypto';
import { SESSION_DURATION } from '../config/AuthConfig';
import SessionDatabase from '../databases/SessionDatabase';
import { toMs } from '../libs/time';
import { TimeUnit } from '../types/TimeTypes';
import { logger } from '../utils/Logging';

class Session {
    protected id: string;
    protected email: string;
    protected expirationDate: Date;
    public staySignedIn: boolean;

    public constructor(id: string, email: string, expirationDate: Date, staySignedIn: boolean) {
        this.id = id;
        this.email = email;
        this.expirationDate = expirationDate;
        this.staySignedIn = staySignedIn;
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

    public getExpirationDate() {
        return this.expirationDate;
    }

    public async extend(time: number, unit: TimeUnit) {
        this.expirationDate = new Date(this.expirationDate.getTime() + toMs(time, unit));

        await this.save();

        logger.debug(`Extended session of user: ${this.email}`);
    }

    public async save() {
        SessionDatabase.set(this);
    }

    public async delete() {
        SessionDatabase.remove(this.id);

        logger.debug(`Deleted session of user: ${this.email}`);
    }

    // STATIC METHODS
    protected static generateId() {
        return crypto.randomUUID();
    }

    public static async findById(id: string) {
        return SessionDatabase.get(id);
    }

    public static async create(email: string, staySignedIn: boolean = false) {
        let id = '';

        // Find a unique, non-existent ID for the new session 
        while (!id || await Session.findById(id)) {
            id = Session.generateId();
        }

        // Generate default expiration date for session
        const expirationDate = new Date(new Date().getTime() + toMs(SESSION_DURATION.time, SESSION_DURATION.unit));

        // Create session
        const session = new Session(id, email, expirationDate, staySignedIn);

        // Store session in database
        await session.save();

        logger.debug(`Created new session for user: ${email}`);

        return session;
    }
}

export default Session;