import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { logger } from '../utils/logger';
import { APP_DB } from '..';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { sleep } from '../utils/time';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import User from '../models/user/User';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';

const DeleteUserController: RequestHandler = async (req, res, next) => {
    const { session } = req;
    const { email } = req.body;

    try {
        logger.debug(`User '${session.getEmail()}' is trying to delete account '${email}'.`);
        
        const user = User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }
        
        await sleep(new TimeDuration(2, TimeUnit.Second));
        await APP_DB.delete(`user:${email}`);
        logger.debug(`Deleted user successfully.`);

        // Remove cookie as it is now invalid (sessions have been deleted)
        if (session.getEmail() === email) {
            res.clearCookie(SESSION_COOKIE);
        }
        
        return res.json(
            successResponse(),
        );

    } catch (err: any) {
        next(err);
    }
}

export default DeleteUserController;