import { Request, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { successResponse } from '../utils/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { logger } from '../utils/logger';
import SecretManager from '../models/SecretManager';
import User from '../models/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';

const validateQuery = async (req: Request) => {
    const { token } = req.query;

    if (!token) {
        throw new Error('MISSING_TOKEN');
    }

    const { email } = await SecretManager.decodeForgotPasswordToken(token as string);

    return { email };
}

type Body = {
    password: string,
    token: string,
 };



const ResetPassword: RequestHandler = async (req, res) => {
    try {
        const { email } = await validateQuery(req);
        const { password } = req.body as Body;

        logger.info(`Trying to reset password for user '${email}'...`);

        const user = await User.findByEmail(email);

        // User should exist in database
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        await user.resetPassword(password);
        
        logger.debug(`User '${user.getEmail()}' has successfully reset their password.`);

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