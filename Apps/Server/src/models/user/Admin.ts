import UserPassword from './UserPassword';
import UserLogin from './UserLogin';
import UserEmail from './UserEmail';
import UserSecret from './UserSecret';
import { UserType } from '../../constants';
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
            ...args,
            type: UserType.Admin,
            username: args.email.getValue(),
        });
    }

    public static async create(email: string, password: string) {

        // Create new admin user
        const user = await User.create(email, password, UserType.Admin, true);

        return user;
    }
}

export default Admin;