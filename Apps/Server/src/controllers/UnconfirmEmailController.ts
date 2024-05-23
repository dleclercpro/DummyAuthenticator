import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist, ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { ClientError } from '../constants';
import User from '../models/user/User';
import { logger } from '../utils/logger';

type Body = {
    email: string,
 };

const UnconfirmEmailController: RequestHandler = async (req, res, next) => {
    let email = '';

    try {
        const { session } = req;
        const { email: targetEmail } = req.body as Body;
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

        logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is unconfirming e-mail of user '${targetUser.getEmail().getValue()}'...`);
        
        targetUser.getEmail().unconfirm();
        await targetUser.save();

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

export default UnconfirmEmailController;