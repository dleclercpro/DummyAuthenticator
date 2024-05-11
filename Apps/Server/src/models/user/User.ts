import { APP_DB } from '../..';
import PasswordManager from '../auth/PasswordManager';
import UserPassword from './UserPassword';
import UserLogin from './UserLogin';
import UserEmail from './UserEmail';
import UserSecret from './UserSecret';
import { UserType } from '../../constants';
import { getRandomWord } from '../../utils/string';
import { Token } from '../../types/TokenTypes';

export interface UserArgs {
    type: UserType,
    email: UserEmail,
    password: UserPassword,
    login: UserLogin,
    secret: UserSecret,
    tokens?: Token[],
}



class User {
    protected type: UserType;
    protected email: UserEmail;
    protected password: UserPassword;
    protected login: UserLogin;
    protected secret: UserSecret;
    protected tokens: Token[];

    public constructor(args: UserArgs) {
        this.type = args.type;
        this.email = args.email;
        this.password = args.password;
        this.login = args.login;
        this.secret = args.secret;
        this.tokens = args.tokens ?? [];
    }

    public serialize() {
        return JSON.stringify({
            type: this.type,
            email: this.email.serialize(),
            password: this.password.serialize(),
            login: this.login.serialize(),
            secret: this.secret.serialize(),
            tokens: this.tokens,
        });
    }

    public static deserialize(str: string) {
        const args = JSON.parse(str);

        const user = new User({
            ...args,
            email: UserEmail.deserialize(args.email),
            password: UserPassword.deserialize(args.password),
            login: UserLogin.deserialize(args.login),
            secret: UserSecret.deserialize(args.secret),
        });

        return user;
    }

    public stringify() {
        return this.getEmail().getValue();
    }

    public getId() {
        return this.getEmail().getValue();
    }

    public getType() {
        return this.type;
    }

    public getEmail() {
        return this.email;
    }

    public getPassword() {
        return this.password;
    }

    public getLogin() {
        return this.login;
    }

    public getSecret() {
        return this.secret;
    }

    public getTokens() {
        return this.tokens;
    }

    public addToken(token: Token) {
        this.tokens.push(token);
    }

    public setTokens(tokens: Token[]) {
        this.tokens = tokens;
    }

    public isAdmin() {
        return this.type === UserType.Admin;
    }

    public async save() {
        await APP_DB.set(`user:${this.email.getValue()}`, this.serialize());
    }

    public async delete() {
        await APP_DB.delete(`user:${this.email.getValue()}`);
    }

    // STATIC METHODS
    public static async findByEmail(email: string) {
        const userAsString = await APP_DB.get(`user:${email}`);

        if (userAsString) {
            return User.deserialize(userAsString);
        }
    }

    public static async create(email: string, password: string) {

        // Create new user
        const user = new User({
            type: UserType.Regular,
            email: new UserEmail({
                value: email,
            }),
            password: new UserPassword({
                value: await PasswordManager.hash(password),
            }),
            login: new UserLogin({}),
            secret: new UserSecret({
                value: getRandomWord(),
            }),
        });

        // Store user in database
        await user.save();

        return user;
    }
}

export default User;