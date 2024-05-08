import PasswordManager from '../auth/PasswordManager';
import UserPassword from './UserPassword';
import UserLogin from './UserLogin';
import UserEmail from './UserEmail';
import UserSecret from './UserSecret';
import { UserType } from '../../constants';
import { getRandomWord } from '../../utils/string';
import User from './User';

interface AdminArgs {
    email: UserEmail,
    password: UserPassword,
    login: UserLogin,
    secret: UserSecret,
}



class Admin extends User {

    public constructor(args: AdminArgs) {
        super({
            type: UserType.Admin,
            ...args,
        });
    }

    public static async create(email: string, password: string) {

        // Create new admin user
        const user = new Admin({
            email: new UserEmail({
                value: email,
                confirmed: true, // Admin users do not need to confirm their e-mail
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

export default Admin;