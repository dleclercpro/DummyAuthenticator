import { SERVER_RETRY_CONN_MAX_BACKOFF } from '../config/Config';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

export const getExponentialBackoff = (attempts: number, base: number = 2, maxBackoff: TimeDuration = SERVER_RETRY_CONN_MAX_BACKOFF) => {
    const exponentialBackoff = new TimeDuration(Math.pow(base, attempts), TimeUnit.Second);

    // Backoff exponentially
    if (exponentialBackoff.smallerThan(maxBackoff)) {
        return exponentialBackoff;
    }
    return maxBackoff;
}