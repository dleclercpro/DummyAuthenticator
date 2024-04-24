import randomWords from 'random-words';
import { DB } from '../..';
import PasswordManager from './PasswordManager';
import Password from './Password';

const getRandomWord = () => randomWords({ exactly: 1, join: `` });

type UserTokens = Record<string, string>;

interface UserArgs {
    email: string,
    password: Password,
    secret: string,
    tokens: UserTokens,
}

class User {
    protected email: string;
    public password: Password;
    protected secret: string;
    protected tokens: UserTokens;

    public constructor(args: UserArgs) {
        this.email = args.email;
        this.password = args.password;
        this.secret = args.secret;
        this.tokens = {};
    }

    public serialize() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
            secret: this.secret,
            tokens: this.tokens,
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

    public getTokens() {
        return this.tokens;
    }

    public async setToken(name: string, value: string) {
        this.tokens[name] = value;

        await this.save();
    }

    public async renewSecret() {
        this.secret = getRandomWord();

        await this.save();
    }

    public async save() {
        await DB.set(`user:${this.email}`, this.serialize());
    }

    public async delete() {
        await DB.delete(`user:${this.email}`);
    }

    // STATIC METHODS
    public static async findByEmail(email: string) {
        const userAsString = await DB.get(`user:${email}`);

        if (userAsString) {
            return User.deserialize(userAsString);
        }
    }

    public static async create(email: string, password: string) {

        // Create new user
        const user = new User({
            email,
            password: new Password({
                value: await PasswordManager.hash(password),
            }),
            secret: getRandomWord(),
            tokens: {},
        });

        // Store user in database
        await user.save();

        return user;
    }
}

export default User;