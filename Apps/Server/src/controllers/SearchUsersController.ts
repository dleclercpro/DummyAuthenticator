import { RequestHandler } from 'express';
import { errorResponse, successResponse } from '../utils/calls';
import { logger } from '../utils/logger';
import User from '../models/user/User';
import { UserJSON } from '../types/JSONTypes';
import { ErrorUserDoesNotExist } from '../errors/UserErrors';
import { HttpStatusCode } from '../types/HTTPTypes';
import { ClientError } from '../constants';

const SearchUsersController: RequestHandler = async (req, res, next) => {
    let email = '';

    try {
        const { session } = req;
        const { searchText } = req.body;

        email = session.getEmail();

        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        logger.trace(`User '${session.getEmail()}' is searching for users: ${searchText}`);
        const targetUsers = await User.find(searchText);
        logger.trace(`Found ${targetUsers.length} users matching search criteria.`);

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

export default SearchUsersController;