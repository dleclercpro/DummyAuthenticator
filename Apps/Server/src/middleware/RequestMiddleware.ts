import { RequestHandler } from 'express';
import { logger } from '../utils/logger';

export const RequestMiddleware: RequestHandler = (req, res, next) => {
    const { method, ip, originalUrl: url } = req;

    logger.debug(`[${method}] ${url} (${ip})`);

    next();
}