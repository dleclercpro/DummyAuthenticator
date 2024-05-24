import pino from 'pino';
import { ENV, PROD } from '../config/AppConfig';
import { Environment } from '../types';

const DEV_OPTIONS = {
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
};

const PROD_OPTIONS = {
    level: 'info',
};

const getLogger = (env: Environment) => {
    switch (env) {
        case Environment.Development:
            return pino(DEV_OPTIONS);
        case Environment.Production:
            return pino(PROD_OPTIONS);
        default:
            return pino({
                level: 'trace',
                transport: {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                    },
                },
            });
    }
} 

export const logger = getLogger(ENV);