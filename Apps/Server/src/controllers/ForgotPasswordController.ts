import { Request, RequestHandler } from 'express';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import { validate } from 'email-validator';
import { ErrorInvalidEmail } from '../errors/ServerError';
import User from '../models/User';
import SecretManager from '../models/SecretManager';
import Gmailer from '../models/emails/Gmailer';
import PasswordRecoveryEmail from '../models/emails/PasswordRecoveryEmail';

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



const ForgotPasswordController: RequestHandler = async (req, res) => {
    try {
        logger.info(`Forgot password...`);

        const { email } = validateBody(req);

        // Try and find user in database
        let user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }
        logger.debug(`User '${user.getEmail()}' wants to reset their password...`);

        // Generate reset password token
        const token = await SecretManager.generateForgotPasswordToken(user);

        // Send user e-mail to reset their password
        await Gmailer.send(new PasswordRecoveryEmail(email, token));

        // Success
        return res.json(successResponse());

    } catch (err: any) {

        // Unknown error
        logger.warn(err, `Unknown error:`);

        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default ForgotPasswordController;