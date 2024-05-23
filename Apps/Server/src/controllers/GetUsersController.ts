import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ClientError } from '../constants';
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

        const users = await User.getAll();

        return res.json(successResponse(
            users.map((user) => ({
                type: user.getType(),
                email: user.getEmail().getValue(),
                confirmed: user.getEmail().isConfirmed(),
            })),
        ));

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