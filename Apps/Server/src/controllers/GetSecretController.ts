import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import GetUserCommand from '../commands/user/GetUserCommand';
import { sleep } from '../utils/time';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';

const GetSecretController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {

        // Try and find user in database
        const user = await new GetUserCommand({ email: session.getEmail() }).execute();

        // Re-new user secret
        await user.renewSecret();

        // Fake some processing time for fetching of the secret
        await sleep(new TimeDuration(1, TimeUnit.Second));

        // Success
        return res.json(successResponse(user.getSecret()));

    } catch (err: any) {
        next(err);
    }
}

export default GetSecretController;