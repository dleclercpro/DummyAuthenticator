import * as bcrypt from 'bcrypt';
import { N_PASSWORD_SALT_ROUNDS } from '../config/AuthConfig';
import UserDatabase from '../databases/UserDatabase';

class User {
    protected email: string;
    protected password: string;

    public constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    public stringify() {
        return this.getEmail();
    }

    public getId() {
        return this.getEmail();
    }

    public getEmail() {
        return this.email;
    }

    public getPassword() {
        return this.password;
    }

    public async isPasswordValid(password: string) {
        return bcrypt.compare(password, this.password);
    }

    public async save() {
        const db = UserDatabase.get();

        db.set(this);
    }

    public async delete() {
        const db = UserDatabase.get();

        db.remove(this.email);
    }

    // STATIC METHODS
    public static async findByEmail(email: string) {
        const db = UserDatabase.get();

        return db.get(email);
    }

    public static async create(email: string, password: string) {

        // Create new user with encrypted password
        const user = new User(email, await bcrypt.hash(password, N_PASSWORD_SALT_ROUNDS));

        // Store user in database
        const db = UserDatabase.get();

        db.set(user);

        return user;
    }
}

export default User;