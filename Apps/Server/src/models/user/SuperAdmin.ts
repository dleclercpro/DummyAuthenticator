import UserPassword from './UserPassword';
import UserLogin from './UserLogin';
import UserEmail from './UserEmail';
import UserSecret from './UserSecret';
import { UserType } from '../../constants';
import User from './User';

interface SuperAdminArgs {
    email: UserEmail,
    password: UserPassword,
    login: UserLogin,
    secret: UserSecret,
}



class SuperAdmin extends User {

    public constructor(args: SuperAdminArgs) {
        super({
            ...args,
            type: UserType.SuperAdmin,
            username: args.email.getValue(),
        });
    }

    public static async create(email: string, password: string) {

        // Create new super admin user
        const user = await User.create(email, password, UserType.SuperAdmin, true);

        return user;
    }
}

export default SuperAdmin;