import * as bcrypt from 'bcrypt';
import randomWords from 'random-words';
import { N_PASSWORD_SALT_ROUNDS } from '../config/AuthConfig';
import { USER_DB } from '..';

const getRandomWord = () => randomWords({ exactly: 1, join: `` });

interface UserArgs {
    email: string, password: string, secret: string,
}

class User {
    protected email: string;
    protected password: string;
    protected secret: string;

    public constructor(args: UserArgs) {
        this.email = args.email;
        this.password = args.password;
        this.secret = args.secret;
    }

    public serialize() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
            secret: this.secret,
        });
    }

    public static deserialize(str: string) {
        return new User(JSON.parse(str));
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

    public getSecret() {
        return this.secret;
    }

    public async renewSecret() {
        this.secret = getRandomWord();

        await this.save();
    }

    public async isPasswordValid(password: string) {
        return bcrypt.compare(password, this.password);
    }

    public async save() {
        USER_DB.add(`user:${this.email}`, this.serialize());
    }

    public async delete() {
        USER_DB.remove(this.email);
    }

    // STATIC METHODS
    public static async findByEmail(email: string) {
        const userAsString = await USER_DB.get(email);

        if (userAsString) {
            return User.deserialize(userAsString);
        }
    }

    public static async create(email: string, password: string) {

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, N_PASSWORD_SALT_ROUNDS);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            secret: getRandomWord(),
        });

        // Store user in database
        USER_DB.add(user.getId(), user.serialize());

        return user;
    }
}

export default User;