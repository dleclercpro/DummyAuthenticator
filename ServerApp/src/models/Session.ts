import crypto from 'crypto';
import { SESSION_DURATION } from '../config/AuthConfig';
import SessionDatabase from '../databases/SessionDatabase';
import { toMs } from '../libs/time';
import { TimeUnit } from '../types/TimeTypes';

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

        console.log(`Extended session of user: ${this.email}`);
    }

    public async save() {
        const db = SessionDatabase.get();

        db.set(this);
    }

    public async delete() {
        const db = SessionDatabase.get();

        db.remove(this.id);

        console.log(`Deleted session of user: ${this.email}`);
    }

    // STATIC METHODS
    protected static generateId() {
        return crypto.randomUUID();
    }

    public static async findById(id: string) {
        const db = SessionDatabase.get();

        return db.get(id);
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

        console.log(`Created new session for user: ${email}`);

        return session;
    }
}

export default Session;