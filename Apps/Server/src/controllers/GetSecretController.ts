import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { sleep } from '../utils/time';
import { TimeUnit } from '../types/TimeTypes';
import TimeDuration from '../models/units/TimeDuration';
import User from '../models/user/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { logger } from '../utils/logger';
import SecretManager from '../models/auth/SecretManager';

type Body = {
    renew: boolean,
};



const GetSecretController: RequestHandler = async (req, res, next) => {
    const { session } = req;
    const { renew } = req.body as Body;

    try {
        const user = await User.findByEmail(session.getEmail());
        if (!user) {
            throw new ErrorUserDoesNotExist(session.getEmail());
        }

        // Get secret
        logger.trace(`${user.getType()} user '${user.getEmail().getValue()}' is asking for its secret.`);
        let secret = user.getSecret();

        // Renew user secret
        if (renew) {
            logger.trace(`Renewing ${user.getType().toLowerCase()} user's secret: ${user.getEmail().getValue()}`);
            secret = await SecretManager.renew(secret);

            // Fake some processing time for renewal of secret
            await sleep(new TimeDuration(1, TimeUnit.Second));
    
            // Store it in database
            await user.save();
        }

        return res.json(successResponse(secret.getValue()));

    } catch (err: any) {
        next(err);
    }
}

export default GetSecretController;