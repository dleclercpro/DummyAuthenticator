import Session from '../models/Session';
import { MemoryDatabase } from './MemoryDatabase';

// The session database is a singleton and exists
// in local memory for demonstration purposes
class SessionDatabase extends MemoryDatabase<Session> {
    private static instance?: SessionDatabase;

    private constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SessionDatabase();
        }

        return this.instance;
    }
}

export default SessionDatabase.getInstance();