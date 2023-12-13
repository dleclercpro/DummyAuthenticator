import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
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

export const DB_RETRY_CONNECT_MAX_DELAY = new TimeDuration(3, TimeUnit.Second);
export const DB_RETRY_CONNECT_TIMEOUT = new TimeDuration(5, TimeUnit.Second);
export const DB_RETRY_CONNECT_MAX = 5;