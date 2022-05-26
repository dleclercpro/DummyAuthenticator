import { ErrorUserDoesNotExist, ErrorUserWrongPassword } from '../../errors/UserErrors';
import Session from '../../models/Session';
import User from '../../models/User';
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
        await user.isPasswordValid(password);

        // Create session for user
        const session = await Session.create(user.getEmail(), staySignedIn);

        return { user, session };
    }

    protected handleError(err: any) {
        if (err.code === ErrorUserDoesNotExist.code ||
            err.code === ErrorUserWrongPassword.code) {
            console.warn(err.message);
        }

        return err;
    }
}

export default SignInCommand;