import { Response, NextFunction, Request } from 'express';
import { HttpStatusCode, HttpStatusMessage } from '../types/HTTPTypes';
import { errorResponse } from '../utils/calls';
import { SESSION_COOKIE } from '../config/AuthConfig';
import { logger } from '../utils/logger';

const ErrorMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    logger.fatal(`An unexpected error occurred: ${err.message}`);
  }

  // Log user out, just in case
  return res
    .clearCookie(SESSION_COOKIE)
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json(errorResponse(HttpStatusMessage.INTERNAL_SERVER_ERROR));
}

export default ErrorMiddleware;