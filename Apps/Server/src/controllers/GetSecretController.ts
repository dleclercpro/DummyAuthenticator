import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { sleep } from '../utils/time';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';
import User from '../models/auth/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';

const GetSecretController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        const user = await User.findByEmail(session.getEmail());
        if (!user) {
            throw new ErrorUserDoesNotExist(session.getEmail());
        }

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