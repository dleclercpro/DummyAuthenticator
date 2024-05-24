import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist, ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { ClientError, UserType } from '../constants';
import User from '../models/user/User';
import { logger } from '../utils/logger';

type Body = {
    email: string,
    type?: UserType,
    ban?: boolean,
 };

const EditUserController: RequestHandler = async (req, res, next) => {
    let email = '';

    try {
        const { session } = req;
        const { email: targetEmail, type, ban } = req.body as Body;
        email = session.getEmail();

        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        if (!user.isAdmin()) {
            throw new ErrorUserMustBeAdmin();
        }

        const targetUser = await User.findByEmail(targetEmail);
        if (!targetUser) {
            throw new ErrorUserDoesNotExist(targetEmail);
        }

        if (type && targetUser.getType() !== type) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is setting user type of user '${targetUser.getEmail().getValue()}' to: ${type}`);

            targetUser.setType(type);
            await targetUser.save();
        }

        if (ban) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is banning user '${targetUser.getEmail().getValue()}'...`);

            targetUser.ban();
            await targetUser.save();
        }

        return res.json(successResponse());

    } catch (err: any) {
        logger.warn(err.message);

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json(errorResponse(ClientError.UserDoesNotExist));
        }

        next(err);
    }
}

export default EditUserController;