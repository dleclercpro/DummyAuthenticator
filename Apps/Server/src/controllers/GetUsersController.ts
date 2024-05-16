import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist, ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { ClientError, UserType } from '../constants';
import User from '../models/user/User';
import { logger } from '../utils/logger';

const GetUsersController: RequestHandler = async (req, res, next) => {
    let email = '';

    try {
        const { session } = req;
        email = session.getEmail();

        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        if (!session.isAdmin()) {
            throw new ErrorUserMustBeAdmin();
        }

        const users = await User.getAll();
        const regularUsers = users
            .filter((user) => user.getType() === UserType.Regular);
        const adminUsers = users
            .filter((user) => user.getType() === UserType.Admin);

        return res.json(successResponse({
            users: regularUsers
                .map((user) => (user.getEmail())),
            admins: adminUsers
                .map((user) => (user.getEmail())),
        }));

    } catch (err: any) {
        logger.warn(`Failed login attempt for user: ${email}`);
        logger.warn(err.message);

        if (err.code === ErrorUserDoesNotExist.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.InvalidCredentials));
        }

        next(err);
    }
}

export default GetUsersController;