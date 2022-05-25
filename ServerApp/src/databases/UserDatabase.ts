import User from '../models/User';
import { MemoryDatabase } from './MemoryDatabase';

// The user database is a singleton and exists
// in local memory for demonstration purposes
class UserDatabase extends MemoryDatabase<User> {
    private static instance?: UserDatabase;

    private constructor() {
        super();
    }

    public static get() {
        if (!this.instance) {
            this.instance = new UserDatabase();
        }

        return this.instance;
    }
}

export default UserDatabase;