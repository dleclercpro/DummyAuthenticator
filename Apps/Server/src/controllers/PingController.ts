import { RequestHandler } from 'express';
import { successResponse } from '../utils/calls';

const PingController: RequestHandler = async (req, res, next) => {
    try {
        const { session } = req;

        return res.json(successResponse({
            email: session.getEmail(),
            isAdmin: session.isAdmin(),
        }));

    } catch (err: any) {
        next(err);
    }
}

export default PingController;