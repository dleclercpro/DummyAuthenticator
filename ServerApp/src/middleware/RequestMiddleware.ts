import { RequestHandler } from 'express';

export const RequestMiddleware: RequestHandler = (req, res, next) => {
    const { method, ip, originalUrl: url } = req;

    console.debug(`[${method}] ${url} (${ip})`);

    next();
}