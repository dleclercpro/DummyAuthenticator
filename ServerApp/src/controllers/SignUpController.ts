import { validate } from 'email-validator';
import { RequestHandler } from 'express';
import CreateUserCommand from '../commands/user/CreateUserCommand';
import { ErrorInvalidEmail } from '../errors/ServerError';
import { ErrorUserAlreadyExists } from '../errors/UserErrors';
import { successResponse } from '../libs/calls';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';

const SignUpController: RequestHandler = async (req, res) => {
    let { email, password } = req.body;
    
    try {

        // Sanitize e-mail
        email = email.trim().toLowerCase();

        // Validate e-mail
        if (!validate(email)) {
            throw new ErrorInvalidEmail(email);
        }
        
        // Create new user in database
        await new CreateUserCommand({ email, password }).execute();

        // Success
        return res.json(successResponse());

    } catch (err: any) {
        console.error(err);

        // Do not tell client why user can't sign up: just pretend
        // everything was fine
        if (err.code === ErrorUserAlreadyExists.code) {
            return res.json(successResponse());
        }

        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default SignUpController;