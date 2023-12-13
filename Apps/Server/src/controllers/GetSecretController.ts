import { RequestHandler } from 'express';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../libs/calls';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ClientError } from '../errors/ClientErrors';
import GetUserCommand from '../commands/user/GetUserCommand';
import { sleep } from '../libs/time';
import { TimeUnit } from '../types/TimeTypes';
import { logger } from '../utils/Logging';
import TimeDuration from '../models/units/TimeDuration';

const GetSecretController: RequestHandler = async (req, res) => {
    const { renew } = req.body;
    
    const { session } = req;

    try {

        // Try and find user in database
        const user = await new GetUserCommand({ email: session.getEmail() }).execute();

        // Re-new user secret
        if (renew) {
            await user.renewSecret();
        }

        // Fake some processing time for fetching of the secret
        await sleep(new TimeDuration(1, TimeUnit.Second));

        // Success
        return res.json(successResponse(user.getSecret()));

    } catch (err: any) {
        logger.warn(err.message);

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

export default GetSecretController;