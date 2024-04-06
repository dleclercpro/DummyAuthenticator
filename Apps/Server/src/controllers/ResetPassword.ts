import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import SecretManager from '../models/SecretManager';
import User from '../models/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';

type Body = {
    password: string,
    token: string,
 };

const ResetPassword: RequestHandler = async (req, res) => {
    try {
        logger.info(`Resetting password...`);

        const { password, token } = req.body as Body;

        const email = await SecretManager.decodeForgotPasswordToken(token);

        logger.info(`User '${email}' wants to reset their password.`);

        const user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        await user.resetPassword(password);

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

export default ResetPassword;