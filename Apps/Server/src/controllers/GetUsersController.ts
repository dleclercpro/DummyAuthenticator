import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { ClientError } from '../constants';
import User from '../models/user/User';
import { logger } from '../utils/logger';
import { UserJSON } from '../types/JSONTypes';

const GetUsersController: RequestHandler = async (req, res, next) => {
    let email = '';

    try {
        const { session } = req;

        email = session.getEmail();

        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        const targetUsers = await User.getAll();

        return res.json(successResponse(
            targetUsers.map((targetUser: User) => ({
                type: targetUser.getType(),
                email: targetUser.getEmail().getValue(),
                favorited: user.isFavorite(targetUser),
                banned: targetUser.isBanned(),
                confirmed: targetUser.getEmail().isConfirmed(),
            })) as UserJSON[],
        ));

    } catch (err: any) {
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