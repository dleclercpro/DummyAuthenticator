import pino from 'pino';
import { PROD } from '../config/AppConfig';

const DEFAULT_OPTIONS = {
    level: 'trace',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
};

const PROD_OPTIONS = {
    level: 'debug',
};

export const logger = pino(PROD ? PROD_OPTIONS : DEFAULT_OPTIONS);