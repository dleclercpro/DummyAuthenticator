import { validate } from 'email-validator';
import { RequestHandler } from 'express';
import { ErrorInvalidEmail, ErrorInvalidPassword } from '../errors/ServerError';
import { ErrorUserAlreadyExists } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../utils/calls';
import { HttpStatusCode } from '../types/HTTPTypes';
import PasswordManager from '../models/auth/PasswordManager';
import { ClientError } from '../constants';
import { logger } from '../utils/logger';
import User from '../models/auth/User';

const SignUpController: RequestHandler = async (req, res, next) => {
    let { email, password } = req.body;
    
    try {
        // Sanitize input
        email = email.trim().toLowerCase();

        // Validate e-mail
        if (!validate(email)) {
            throw new ErrorInvalidEmail(email);
        }

        // Validate password
        if (!PasswordManager.areRulesFollowed(password)) {
            throw new ErrorInvalidPassword();
        }
        
        // Create new user in database
        let user = await User.findByEmail(email);
        if (user) {
            throw new ErrorUserAlreadyExists(user);
        }
        
        // Create new user instance
        user = await User.create(email, password);
        logger.info(`New user created: ${user.getEmail()}`);

        return res.json(successResponse());

    } catch (err: any) {

        // User already exists
        if (err.code === ErrorUserAlreadyExists.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.UserAlreadyExists));
        }

        // Invalid email
        if (err.code === ErrorInvalidEmail.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.InvalidEmail));
        }

        // Invalid password
        if (err.code === ErrorInvalidPassword.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.InvalidPassword));
        }

        next(err);
    }
}

export default SignUpController;