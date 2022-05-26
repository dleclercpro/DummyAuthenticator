import { validate } from 'email-validator';
import { RequestHandler } from 'express';
import CreateUserCommand from '../commands/user/CreateUserCommand';
import { PASSWORD_OPTIONS } from '../config/AuthConfig';
import { ClientError } from '../errors/ClientErrors';
import { ErrorInvalidEmail, ErrorInvalidPassword } from '../errors/ServerError';
import { ErrorUserAlreadyExists } from '../errors/UserErrors';
import { errorResponse, successResponse } from '../libs/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { validatePassword } from '../utils/Validation';

const SignUpController: RequestHandler = async (req, res) => {
    let { email, password } = req.body;
    
    try {

        // Sanitize input
        email = email.trim().toLowerCase();

        // Validate e-mail
        if (!validate(email)) {
            throw new ErrorInvalidEmail(email);
        }

        // Validate password
        if (!validatePassword(password)) {
            throw new ErrorInvalidPassword();
        }
        
        // Create new user in database
        await new CreateUserCommand({ email, password }).execute();

        // Success
        return res.json(successResponse());

    } catch (err: any) {
        console.warn(err.message);

        // Do not tell client why user can't sign up: just pretend
        // everything was fine
        if (err.code === ErrorUserAlreadyExists.code) {
            return res.json(successResponse());
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

        // Unknown error
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default SignUpController;