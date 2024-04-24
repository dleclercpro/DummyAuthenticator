import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { sleep } from '../utils/time';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';
import User from '../models/auth/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { logger } from '../utils/logger';

const GetSecretController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        const user = await User.findByEmail(session.getEmail());
        if (!user) {
            throw new ErrorUserDoesNotExist(session.getEmail());
        }

        // Re-new user secret
        const secret = await user.renewSecret();
        logger.info(`User '${user.getEmail()}' is asking for a new secret: ${secret}`);

        // Fake some processing time for fetching of the secret
        await sleep(new TimeDuration(1, TimeUnit.Second));

        return res.json(successResponse(secret));

    } catch (err: any) {
        next(err);
    }
}

export default GetSecretController;