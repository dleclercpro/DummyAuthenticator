import { Request, RequestHandler } from 'express';
import { ErrorEmailNotConfirmed, ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import { validate } from 'email-validator';
import { ErrorInvalidEmail, ErrorInvalidPassword } from '../errors/ServerError';
import User from '../models/user/User';
import EmailFactory from '../models/emails/EmailFactory';
import Gmailer from '../models/emails/Gmailer';
import { ClientError } from '../constants';
import TokenManager from '../models/auth/TokenManager';

const validateBody = (req: Request) => {
    let { email }: { email: string } = req.body;

    // Sanitize input
    email = email.trim().toLowerCase();

    // Validate e-mail
    if (!validate(email)) {
        throw new ErrorInvalidEmail(email);
    }

    return { email };
}



const ForgotPasswordController: RequestHandler = async (req, res, next) => {
    try {
        const { email } = validateBody(req);

        // Try and find user in database
        let user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }
        logger.debug(`${user.getType()} user '${user.getEmail().getValue()}' wants to reset their password...`);

        // Is e-mail confirmed?
        if (!user.getEmail().isConfirmed()) {
            throw new ErrorEmailNotConfirmed(user);
        }

        // Generate password recovery token
        const token = await TokenManager.generateResetPasswordToken(user);

        // Store its creation time
        user.getPassword().setLastRequest(new Date(token.content.creationDate));
        await user.save();

        // Send user e-mail to reset their password
        await Gmailer.send(await EmailFactory.createResetPasswordEmail(user, token));
        logger.debug(`Password recovery e-mail sent to user: ${user.getEmail().getValue()}`);

        return res.json(successResponse());

    } catch (err: any) {
        if (err.code === ErrorInvalidEmail.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.InvalidEmail));
        }

        if (err.code === ErrorInvalidPassword.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.InvalidPassword));
        }

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.UserDoesNotExist));
        }

        if (err.code === ErrorEmailNotConfirmed.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.UnconfirmedEmail));
        }

        next(err);
    }
}

export default ForgotPasswordController;