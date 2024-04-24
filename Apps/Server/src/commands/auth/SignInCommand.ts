import { ErrorUserWrongPassword } from '../../errors/UserErrors';
import { LoginAttemptType } from '../../models/auth/Login';
import PasswordManager from '../../models/auth/PasswordManager';
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
        const isPasswordValid = await PasswordManager.isValid(password, user.getPassword().getValue());
        
        // Store login attempt
        user.getLogin().addAttempt(isPasswordValid ? LoginAttemptType.Success : LoginAttemptType.Failure);

        await user.save();

        if (!isPasswordValid) {
            throw new ErrorUserWrongPassword(user);
        }

        // Create session for user
        const session = await Session.create(user.getEmail(), staySignedIn);

        return { user, session };
    }
}

export default SignInCommand;