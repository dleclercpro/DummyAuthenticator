import { APP_DB } from '../..';
import PasswordManager from '../auth/PasswordManager';
import UserPassword from './UserPassword';
import UserLogin from './UserLogin';
import UserEmail from './UserEmail';
import UserSecret from './UserSecret';
import { UserType } from '../../constants';
import { Token } from '../../types/TokenTypes';
import { unique } from '../../utils/array';

export interface UserArgs {
    type: UserType,
    banned?: boolean,
    username: string,
    email: UserEmail,
    password: UserPassword,
    login?: UserLogin,
    secret?: UserSecret,
    tokens?: Token[],
    favorites?: string[],
}



class User {
    protected type: UserType;
    protected banned: boolean;
    protected username: string;
    protected email: UserEmail;
    protected password: UserPassword;
    protected login: UserLogin;
    protected secret: UserSecret;
    protected tokens: Token[];
    protected favorites: string[];

    public constructor(args: UserArgs) {
        this.type = args.type;
        this.banned = args.banned ?? false;
        this.username = args.username;
        this.email = args.email;
        this.password = args.password;
        this.login = args.login ?? new UserLogin({}),
        this.secret = args.secret ?? new UserSecret({});
        this.tokens = args.tokens ?? [];
        this.favorites = args.favorites ?? [];
    }

    public serialize() {
        return JSON.stringify({
            type: this.type,
            banned: this.banned,
            username: this.username,
            email: this.email.serialize(),
            password: this.password.serialize(),
            login: this.login.serialize(),
            secret: this.secret.serialize(),
            tokens: this.tokens,
            favorites: this.favorites,
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

    public setType(type: UserType) {
        this.type = type;
    }

    public getUsername() {
        return this.username;
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

    public isSuperAdmin() {
        return this.type === UserType.SuperAdmin;
    }

    public isBanned() {
        return this.banned;
    }

    public unban() {
        this.banned = false;
    }

    public ban() {
        this.banned = true;
    }

    public getFavorites() {
        return this.favorites;
    }

    public isFavorite(user: User) {
        return this.favorites.includes(user.getEmail().getValue());
    }

    public addFavorite(user: User) {
        this.favorites = unique([...this.favorites, user.getEmail().getValue()]);
    }

    public removeFavorite(user: User) {
        this.favorites = this.favorites.filter(favorite => favorite !== user.getEmail().getValue());
    }

    public async save() {
        await APP_DB.set(`user:${this.email.getValue()}`, this.serialize());
    }

    public async delete() {
        await APP_DB.delete(`user:${this.email.getValue()}`);
    }

    public static async getAll(): Promise<User[]> {
        const userKeys: string[] | null = await APP_DB.getKeysByPattern('user:*');
    
        if (!userKeys) {
            return [];
        }
    
        const users: (string | null)[] = await Promise.all(
            userKeys.map((userKey: string) => APP_DB.get(userKey))
        );
    
        return users
            .filter((user): user is string => user !== null) // Type guard to filter out nulls
            .map((user: string) => User.deserialize(user));
    }

    // STATIC METHODS
    public static async findByEmail(email: string) {
        const userAsString = await APP_DB.get(`user:${email}`);

        if (userAsString) {
            return User.deserialize(userAsString);
        }
    }

    public static async find(searchText: string) {
        const userKeys = await APP_DB.getKeysByPattern(`user:*`);
        const resultUserKeys = userKeys
            .map((user: string) => user.replace('user:', ''))
            .filter((user: string) => user.includes(searchText));

        const resultUsers = await Promise.all(
            resultUserKeys
                .map(async (key: string) => {
                    const userAsString = await APP_DB.get(`user:${key}`);

                    return User.deserialize(userAsString!);
                })
        );

        return resultUsers;
    }

    public static async create(email: string, password: string, type: UserType = UserType.Regular, confirmed: boolean = false) {

        // Create new user
        const user = new User({
            type,
            username: email, // Initialize user's username with their e-mail
            email: new UserEmail({
                value: email,
                confirmed,
            }),
            password: new UserPassword({
                value: await PasswordManager.hash(password),
            }),
        });

        // Store user in database
        await user.save();

        return user;
    }
}

export default User;