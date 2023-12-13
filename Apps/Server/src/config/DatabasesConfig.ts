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

export const REDIS_DB_RETRY_CONNECT_MAX_DELAY = new TimeDuration(3, TimeUnit.Second);
export const REDIS_DB_RETRY_CONNECT_MAX = 5;

export const USER_DB_PROTOCOL = process.env.USER_DB_PROTOCOL!;
export const USER_DB_HOST = process.env.USER_DB_HOST!;
export const USER_DB_PORT = parseInt(process.env.USER_DB_PORT!);
export const USER_DB_NAME = process.env.USER_DB_NAME!;
export const USER_DB_ROOT = createURL(USER_DB_PROTOCOL, USER_DB_HOST, USER_DB_PORT);

export const SESSION_DB_PROTOCOL = process.env.SESSION_DB_PROTOCOL!;
export const SESSION_DB_HOST = process.env.SESSION_DB_HOST!;
export const SESSION_DB_PORT = parseInt(process.env.SESSION_DB_PORT!);
export const SESSION_DB_NAME = process.env.SESSION_DB_NAME!;
export const SESSION_DB_ROOT = createURL(SESSION_DB_PROTOCOL, SESSION_DB_HOST, SESSION_DB_PORT);