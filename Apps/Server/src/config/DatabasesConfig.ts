import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const REDIS_USE = [true, 'true'].includes(process.env.REDIS_USE!);

export const REDIS_RETRY_CONN_TIMEOUT = new TimeDuration(5, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_BACKOFF = new TimeDuration(30, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_ATTEMPTS = 5;

export const REDIS_DATABASE = parseInt(process.env.REDIS_DATABASE!, 10);
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT!, 10);
export const REDIS_NAME = process.env.REDIS_NAME!;

export const REDIS_OPTIONS = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    name: REDIS_NAME,
};