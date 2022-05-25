import crypto from 'crypto';
import SessionDatabase from '../databases/SessionDatabase';

class Session {
    protected id: string;
    protected email: string;

    public constructor(id: string, email: string) {
        this.id = id;
        this.email = email;
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

    public async save() {
        const db = SessionDatabase.get();

        db.set(this);
    }

    public async delete() {
        const db = SessionDatabase.get();

        db.remove(this.id);
    }

    // STATIC METHODS
    protected static generateId() {
        return crypto.randomUUID();
    }

    public static async findById(id: string) {
        const db = SessionDatabase.get();

        return db.get(id);
    }

    public static async create(email: string) {
        let id = '';

        // Find a unique, non-existent ID for the new session 
        while (!id || await Session.findById(id)) {
            id = Session.generateId();
        }

        // Create session
        const session = new Session(id, email);

        // Store session in database
        await session.save();

        return session;
    }
}

export default Session;