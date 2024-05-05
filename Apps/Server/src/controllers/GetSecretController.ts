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
        logger.info(`User '${user.getEmail().getValue()}' is asking for its secret.`);

        // Fake some processing time for fetching of the secret
        await sleep(new TimeDuration(1, TimeUnit.Second));

        // Get secret
        const secret = user.getSecret().getValue();

        // Re-new user secret
        logger.debug(`Renewing user's secret: ${user.getEmail().getValue()}`);
        await user.renewSecret();

        return res.json(successResponse(secret));

    } catch (err: any) {
        next(err);
    }
}

export default GetSecretController;