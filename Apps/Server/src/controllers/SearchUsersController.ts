import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';
import { logger } from '../utils/logger';
import User from '../models/user/User';
import Admin from '../models/user/Admin';

const SearchUsersController: RequestHandler = async (req, res, next) => {
    const { session } = req;
    const { searchText } = req.body;

    try {
        logger.debug(`User '${session.getEmail()}' is searching for users...`);
        
        const admins = await Admin.find(searchText);
        logger.debug(`Found ${admins.length} admin users matching search criteria.`);

        const users = await User.find(searchText);
        logger.debug(`Found ${users.length} regular users matching search criteria.`);

        return res.json(successResponse({
            users: users
                .map((user) => (user.getEmail())),
            admins: admins
                .map((user) => (user.getEmail())),
        }));

    } catch (err: any) {
        next(err);
    }
}

export default SearchUsersController;