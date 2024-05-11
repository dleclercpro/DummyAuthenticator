import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { logger } from '../utils/logger';
import { APP_DB } from '..';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { sleep } from '../utils/time';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

const DeleteUserController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        logger.debug(`User '${session.getEmail()}' is trying to delete their account.`);
        await sleep(new TimeDuration(2, TimeUnit.Second));
        await APP_DB.delete(`user:${session.getEmail()}`);
        logger.debug(`Deleted user successfully.`);

        // Remove cookie as it is now invalid (sessions have been deleted)
        return res
            .clearCookie(SESSION_COOKIE)
            .json(
                successResponse(),
            );

    } catch (err: any) {
        next(err);
    }
}

export default DeleteUserController;