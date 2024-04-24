import { HOURLY_LOGIN_ATTEMPT_MAX_COUNT } from '../../config/AuthConfig';
import { ErrorNoMoreLoginAttempts } from '../../errors/ServerError';
import { ErrorUserWrongPassword } from '../../errors/UserErrors';
import { LoginAttemptType } from '../../models/auth/Login';
import PasswordManager from '../../models/auth/PasswordManager';
import Session from '../../models/auth/Session';
import User from '../../models/auth/User';
import TimeDuration from '../../models/units/TimeDuration';
import { TimeUnit } from '../../types/TimeTypes';
import { logger } from '../../utils/logger';
import { computeTime } from '../../utils/time';
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

        // Get failed login attempts in the last hour
        const oneHourAgo = computeTime(new Date(), new TimeDuration(-1, TimeUnit.Hour));
        const failedLoginAttemptsInLastHour = user.getLogin().getAttempts()
            .filter(attempt => attempt.type === LoginAttemptType.Failure)
            .filter(attempt => attempt.timestamp > oneHourAgo);

        // Authenticate user
        const isPasswordValid = await PasswordManager.isValid(password, user.getPassword().getValue());

        // Store login attempt
        user.getLogin()
            .addAttempt(isPasswordValid ? LoginAttemptType.Success : LoginAttemptType.Failure);
        
        await user.save();

        // Only allow X failed login attempts per hour
        if (failedLoginAttemptsInLastHour.length > HOURLY_LOGIN_ATTEMPT_MAX_COUNT) {
            throw new ErrorNoMoreLoginAttempts(user.getEmail(), failedLoginAttemptsInLastHour.length);
        }
        
        if (!isPasswordValid) {
            throw new ErrorUserWrongPassword(user);
        }

        // Create session for user
        const session = await Session.create(user.getEmail(), staySignedIn);

        return { user, session };
    }
}

export default SignInCommand;