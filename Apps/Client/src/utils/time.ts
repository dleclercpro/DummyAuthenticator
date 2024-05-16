import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

export const getExponentialBackoff = (attempts: number, maxBackoff: TimeDuration = new TimeDuration(10, TimeUnit.Second)) => {
    const exponentialBackoff = new TimeDuration(Math.pow(2, attempts), TimeUnit.Second);

    // Backoff exponentially
    if (exponentialBackoff.smallerThan(maxBackoff)) {
        return exponentialBackoff;
    }
    return maxBackoff;
}