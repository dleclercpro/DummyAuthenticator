import { Request, RequestHandler } from 'express';
import { ClientError } from '../errors/ClientErrors';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import { validate } from 'email-validator';
import { ErrorInvalidEmail } from '../errors/ServerError';
import User from '../models/User';
import SecretManager from '../models/SecretManager';
import { CLIENT_ROOT } from '../config/AppConfig';
import Gmailer from '../models/emails/Gmailer';

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



const ForgotPassword: RequestHandler = async (req, res) => {
    try {
        logger.info(`Forgot password...`);

        const { email } = validateBody(req);

        // Try and find user in database
        let user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        // Generate reset password token
        const token = await SecretManager.generateForgotPasswordToken(user);

        // Create reset e-mail password e-mail, in which the user is brought
        // to a reset password page in the client app
        const html = `
            <p>To reset your password, please click on the following link:</p>
            <a href='${CLIENT_ROOT}/reset-password/${token}'>
                Reset password
            </a>
        `;

        // Send user e-mail to reset their password
        await Gmailer.send(html, 'Reset your password', email);

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        // Do not tell client why user can't sign out: just say they
        // are unauthorized!
        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        logger.warn(err, `Unknown error:`);

        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default ForgotPassword;