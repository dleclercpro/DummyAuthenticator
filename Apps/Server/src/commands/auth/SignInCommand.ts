import { ErrorUserDoesNotExist, ErrorUserWrongPassword } from '../../errors/UserErrors';
import Session from '../../models/auth/Session';
import User from '../../models/auth/User';
import { logger } from '../../utils/logger';
import Command from '../Command';
import GetUserCommand from '../user/GetUserCommand';

interface Argument {
    email: string,
    password: string,
    staySignedIn: boolean,
}

interface Response {
    user: User,
    session: Session,
}

class SignInCommand extends Command<Argument, Response> {

    public constructor(argument: Argument) {
        super('SignInCommand', argument);
    }

    protected async doExecute() {
        const { email, password, staySignedIn } = this.argument;

        // Try and find user in database
        const user = await new GetUserCommand({ email }).execute();

        // Authenticate user
        const isPasswordValid = await user.isPasswordValid(password);
        
        if (!isPasswordValid) {
            throw new ErrorUserWrongPassword(user);
        }

        // Create session for user
        const session = await Session.create(user.getEmail(), staySignedIn);

        return { user, session };
    }
}

export default SignInCommand;