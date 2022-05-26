import { TimeUnit } from "../types/TimeTypes";

export const sleep = async (time: number, unit: TimeUnit) => {
    await new Promise(resolve => setTimeout(resolve, toMs(time, unit)));
};

export const toMs = (time: number, unit: TimeUnit) => {
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

export const getTimeFromNow = (dt: number, unit: TimeUnit) => {
    const now = new Date();

    if ((unit === TimeUnit.Year || unit === TimeUnit.Month) && dt % 1 !== 0) {
        throw new Error('Invalid time delta.');
    }

    let then;

    switch (unit) {
        case TimeUnit.Year:
            then = new Date();
            then.setFullYear(now.getFullYear() + dt);
            break;
        case TimeUnit.Month:
            then = new Date();
            then.setMonth(now.getMonth() + dt);
            break;
        case TimeUnit.Day:
        case TimeUnit.Hour:
        case TimeUnit.Minute:
        case TimeUnit.Second:
        case TimeUnit.Millisecond:
            then = new Date(now.getTime() + toMs(dt, unit));
            break;
    }

    if (!then) {
        throw new Error('Cannot compute time from now.');
    }

    return then;
}