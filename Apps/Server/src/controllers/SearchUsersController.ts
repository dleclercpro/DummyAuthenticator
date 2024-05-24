import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { logger } from '../utils/logger';
import User from '../models/user/User';

const SearchUsersController: RequestHandler = async (req, res, next) => {
    const { session } = req;
    const { searchText } = req.body;

    try {
        logger.debug(`User '${session.getEmail()}' is searching for users: ${searchText}`);
        
        const users = await User.find(searchText);
        logger.debug(`Found ${users.length} users matching search criteria.`);

        return res.json(successResponse(
            users.map((user) => ({
                type: user.getType(),
                email: user.getEmail().getValue(),
                banned: user.isBanned(),
                confirmed: user.getEmail().isConfirmed(),
            })),
        ));

    } catch (err: any) {
        next(err);
    }
}

export default SearchUsersController;