import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { logger } from '../utils/logger';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { APP_SERVER } from '..';

const StopServerController: RequestHandler = async (req, res, next) => {
    const { session } = req;

    try {
        logger.debug(`Admin user '${session.getEmail()}' is trying to stop server.`);

        // Cannot stop server unless user is an admin
        if (!session.isAdmin() && !session.isSuperAdmin()) {
            throw new ErrorUserMustBeAdmin();
        }

        logger.debug(`Stopping app server...`);
        await APP_SERVER.stop();

        res.json(successResponse());

        return 

    } catch (err: any) {
        logger.warn(`Failed server stopping attempt for admin user: ${session.getEmail()}`);
        logger.warn(err.message);

        if (err.code === ErrorUserMustBeAdmin.code) {
            return res
                .status(HttpStatusCode.FORBIDDEN)
                .json(errorResponse(HttpStatusMessage.FORBIDDEN));
        }
        
        next(err);
    }
}

export default StopServerController;