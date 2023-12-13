import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

const toMs = (time: number, unit: TimeUnit) => {
    let t; // ms

    switch (unit) {
        case TimeUnit.Day:
            t = time * 24 * 3600 * 1000;
            break;
        case TimeUnit.Hour:
            t = time * 3600 * 1000;
            break;
        case TimeUnit.Minute:
            t = time * 60 * 1000;
            break;
        case TimeUnit.Second:
            t = time * 1000;
            break;
        case TimeUnit.Millisecond:
            t = time;
            break;
        default:
            throw new Error('Invalid time unit.');
    }

    return t;
}