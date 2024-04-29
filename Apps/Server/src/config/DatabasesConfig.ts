import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import { createURL } from '../utils/url';
import { PROD } from './AppConfig';

export const SESSIONS_DB_OPTIONS = {
    host: process.env.SESSIONS_DB_HOST!,
    port: parseInt(process.env.SESSIONS_DB_PORT!),
    name: process.env.SESSIONS_DB_NAME!,
    auth: !PROD ? undefined : {
        user: process.env.SESSIONS_DB_USER!,
        pass: process.env.SESSIONS_DB_PASS!,
    },
};

// Redis
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_RETRY_CONN_TIMEOUT = new TimeDuration(5, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_BACKOFF = new TimeDuration(30, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_ATTEMPTS = 5;

export const USE_REDIS = [true, 'true'].includes(process.env.USE_REDIS!);
export const DB_PROTOCOL = process.env.DB_PROTOCOL!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = parseInt(process.env.DB_PORT!);
export const DB_NAME = process.env.DB_NAME!;
export const DB_ROOT = createURL(DB_PROTOCOL, DB_HOST, DB_PORT);