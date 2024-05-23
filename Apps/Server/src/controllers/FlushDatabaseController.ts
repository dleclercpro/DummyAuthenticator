import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { logger } from '../utils/logger';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { APP_DB } from '..';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { sleep } from '../utils/time';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

const FlushDatabaseController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        logger.debug(`Admin user '${session.getEmail()}' is trying to flush database.`);

        // Cannot stop server unless user is an admin
        if (!session.isAdmin) {
            throw new ErrorUserMustBeAdmin();
        }

        await sleep(new TimeDuration(2, TimeUnit.Second));
        await APP_DB.flush();
        logger.debug(`Flushed database successfully.`);

        // Restore admin users
        await APP_DB.setup();

        // Remove cookie as it is now invalid (sessions have been deleted)
        return res
            .clearCookie(SESSION_COOKIE)
            .json(
                successResponse(),
            );

    } catch (err: any) {
        logger.warn(`Failed database flushing attempt for admin user: ${session.getEmail()}`);
        logger.warn(err.message);

        if (err.code === ErrorUserMustBeAdmin.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(HttpStatusMessage.FORBIDDEN));
        }
        
        next(err);
    }
}

export default FlushDatabaseController;