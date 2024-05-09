import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorEmailNotConfirmed, ErrorUserDoesNotExist, ErrorUserWrongPassword } from '../errors/UserErrors';
import { validate } from 'email-validator';
import { ErrorInvalidEmail, ErrorNoMoreLoginAttempts } from '../errors/ServerError';
import { HOURLY_LOGIN_MAX_ATTEMPTS, SESSION_COOKIE } from '../config/AuthConfig';
import { ClientError } from '../constants';
import Session from '../models/auth/Session';
import { LoginAttemptType } from '../models/user/UserLogin';
import PasswordManager from '../models/auth/PasswordManager';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import { computeDate } from '../utils/time';
import User from '../models/user/User';
import { logger } from '../utils/logger';

const SignInController: RequestHandler = async (req, res, next) => {
    let { email, password, staySignedIn } = req.body;

    let user;

    try {
        // Sanitize input
        email = email.trim().toLowerCase();

        // Validate e-mail
        if (!validate(email)) {
            throw new ErrorInvalidEmail(email);
        }
        
        // Try to sign user in
        user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Is e-mail confirmed?
        if (!user.getEmail().isConfirmed()) {
            throw new ErrorEmailNotConfirmed(user);
        }

        // Get failed login attempts in the last hour
        const oneHourAgo = computeDate(new Date(), new TimeDuration(-1, TimeUnit.Hour));

        const loginAttemptsInLastHour = user.getLogin().getAttempts()
            .filter(attempt => attempt.timestamp > oneHourAgo);
        const failedLoginAttemptsInLastHour = loginAttemptsInLastHour
            .filter(attempt => attempt.type === LoginAttemptType.Failure);

        // Authenticate user
        const isAuthenticated = await PasswordManager.matches(password, user.getPassword().getValue());

        // Only keep login attempts of last hour
        user.getLogin().setAttempts(loginAttemptsInLastHour);

        // Store new login attempt
        user.getLogin().addAttempt(isAuthenticated ? LoginAttemptType.Success : LoginAttemptType.Failure);
        await user.save();

        // Only allow X failed login attempts per hour
        if (failedLoginAttemptsInLastHour.length > HOURLY_LOGIN_MAX_ATTEMPTS) {
            logger.warn(`${user.getType()} user '${user.getEmail().getValue()}' has tried to log in ${loginAttemptsInLastHour.length} times in the last hour.`);
            throw new ErrorNoMoreLoginAttempts(user.getEmail().getValue(), failedLoginAttemptsInLastHour.length);
        }
        
        if (!isAuthenticated) {
            throw new ErrorUserWrongPassword(user);
        }

        // Create session for user
        const session = await Session.create(user, staySignedIn);

        // Set cookie with session ID on client's browser
        res.cookie(SESSION_COOKIE, session.getId());
        logger.debug(`${user.getType()} user logged in: ${user.getEmail().getValue()}`);

        return res.json(successResponse({
            email: user.getEmail().getValue(),
            isAdmin: user.isAdmin(),
        }));

    } catch (err: any) {
        logger.warn(`Failed login attempt for user: ${email}`);
        logger.warn(err.message);

        if (err.code === ErrorUserDoesNotExist.code ||
            err.code === ErrorInvalidEmail.code ||
            err.code === ErrorUserWrongPassword.code
        ) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        if (err.code === ErrorEmailNotConfirmed.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.UnconfirmedEmail));
        }

        if (err.code === ErrorNoMoreLoginAttempts.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.NoMoreLoginAttempts, user ? {
                    attempts: user.getLogin().getAttempts().length,
                    maxAttempts: HOURLY_LOGIN_MAX_ATTEMPTS,
                } : {
                    
                }));
        }

        next(err);
    }
}

export default SignInController;