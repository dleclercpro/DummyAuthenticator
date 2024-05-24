import { RequestHandler } from 'express';
import { HttpStatusCode } from '../types/HTTPTypes';
import { errorResponse, successResponse } from '../utils/calls';
import { ErrorUserDoesNotExist, ErrorUserMustBeAdmin } from '../errors/UserErrors';
import { ClientError, UserType } from '../constants';
import User from '../models/user/User';
import { logger } from '../utils/logger';
import { sleep } from '../utils/time';
import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

type Body = {
    email: string,
    confirm?: boolean,
    type?: UserType,
    ban?: boolean,
    favorite?: boolean,
 };

const EditUserController: RequestHandler = async (req, res, next) => {
    let email = '';
    let edited = false;
    let editedTarget = false;

    try {
        const { session } = req;
        const { email: targetEmail, confirm, type, ban, favorite } = req.body as Body;
        email = session.getEmail();

        const user = await User.findByEmail(email);
        if (!user) {
            throw new ErrorUserDoesNotExist(email);
        }

        if (!user.isAdmin() && !user.isSuperAdmin()) {
            throw new ErrorUserMustBeAdmin();
        }

        const targetUser = await User.findByEmail(targetEmail);
        if (!targetUser) {
            throw new ErrorUserDoesNotExist(targetEmail);
        }

        if (type && targetUser.getType() !== type) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is setting user type of user '${targetUser.getEmail().getValue()}' to: ${type}`);

            targetUser.setType(type);

            editedTarget = true;
        }

        if (confirm !== undefined) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is ${confirm ? 'confirming' : 'unconfirming'} e-mail address of user '${targetUser.getEmail().getValue()}'...`);

            if (confirm) {
                targetUser.getEmail().confirm();
            } else {
                targetUser.getEmail().unconfirm();
            }

            editedTarget = true;
        }

        if (ban !== undefined) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is ${ban ? 'banning' : 'unbanning'} user '${targetUser.getEmail().getValue()}'...`);

            if (ban) {
                targetUser.ban();
            } else {
                targetUser.unban();
            }
            
            editedTarget = true;
        }

        if (favorite !== undefined) {
            logger.info(`${user.getType()} user '${user.getEmail().getValue()}' is ${favorite ? 'adding' : 'removing'} user '${targetUser.getEmail().getValue()}' ${favorite ? 'to' : 'from'} their favorites...`);

            if (favorite) {
                user.addFavorite(targetUser);
            } else {
                user.removeFavorite(targetUser);
            }
            
            edited = true;
        }

        if (edited || editedTarget) {
            await sleep(new TimeDuration(2, TimeUnit.Second));
        }

        if (edited) {
            await user.save();
        }

        if (editedTarget) {
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
        
        if (err.code === ErrorUserMustBeAdmin.code) {
            return res
                .status(HttpStatusCode.UNAUTHORIZED)
                .json(errorResponse(ClientError.UserMustBeAdmin));
        }

        next(err);
    }
}

export default EditUserController;