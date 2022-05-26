import { RequestHandler } from 'express';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../libs/calls';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ClientError } from '../errors/ClientErrors';
import GetUserCommand from '../commands/user/GetUserCommand';

const GetUserController: RequestHandler = async (req, res) => {
    const { session } = req;

    try {

        // Try and find user in database
        const user = await new GetUserCommand({ email: session.getEmail() }).execute();

        // Success
        return res.json(successResponse({ email: user.getEmail() }));

    } catch (err: any) {
        console.warn(err.message);

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        // Unknown error
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
}

export default GetUserController;