import * as bcrypt from 'bcrypt';
import randomWords from 'random-words';
import { N_PASSWORD_SALT_ROUNDS } from '../../config/AuthConfig';
import { DB } from '../..';

const getRandomWord = () => randomWords({ exactly: 1, join: `` });

type UserTokens = Record<string, string>;

interface UserArgs {
    email: string,
    password: string,
    passwordResetCount: number,
    lastPasswordReset: Date | null,
    secret: string,
    tokens: UserTokens,
}

class User {
    protected email: string;
    protected password: string;
    protected lastPasswordReset: Date | null;
    protected passwordResetCount: number;
    protected secret: string;
    protected tokens: UserTokens;

    public constructor(args: UserArgs) {
        this.email = args.email;
        this.password = args.password;
        this.passwordResetCount = args.passwordResetCount;
        this.lastPasswordReset = args.lastPasswordReset;
        this.secret = args.secret;
        this.tokens = {};
    }

    public serialize() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
            passwordResetCount: this.passwordResetCount,
            lastPasswordReset: this.lastPasswordReset,
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

    public getLastPasswordReset() {
        return this.lastPasswordReset;
    }

    public getPasswordResetCount() {
        return this.passwordResetCount;
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

    public async isPasswordValid(password: string) {
        return bcrypt.compare(password, this.password);
    }

    public static async hashPassword(password: string) {
        const hashedPassword = await bcrypt.hash(password, N_PASSWORD_SALT_ROUNDS);

        return hashedPassword;
    }

    public async resetPassword(newPassword: string) {
        this.password = await User.hashPassword(newPassword);
        this.passwordResetCount += 1;
        this.lastPasswordReset = new Date();

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
            password: await User.hashPassword(password),
            passwordResetCount: 0,
            lastPasswordReset: null,
            secret: getRandomWord(),
            tokens: {},
        });

        // Store user in database
        await user.save();

        return user;
    }
}

export default User;