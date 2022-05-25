import { TimeUnit } from "../types/TimeTypes";

export const sleep = async (time: number, unit: TimeUnit) => {
    await new Promise(resolve => setTimeout(resolve, toMs(time, unit)));
};

export const toMs = (time: number, unit: TimeUnit) => {
    let t; // ms

    switch (unit) {
        case TimeUnit.Days:
            t = time * 24 * 3600 * 1000;
            break;
        case TimeUnit.Hours:
            t = time * 3600 * 1000;
            break;
        case TimeUnit.Minutes:
            t = time * 60 * 1000;
            break;
        case TimeUnit.Seconds:
            t = time * 1000;
            break;
        case TimeUnit.Milliseconds:
            t = time;
            break;
        default:
            throw new Error('Invalid time unit.');
    }

    return t;
}

export const getTimeFromNow = (dt: number, unit: TimeUnit) => {
    const now = new Date();

    if ((unit === TimeUnit.Years || unit === TimeUnit.Months) && dt % 1 !== 0) {
        throw new Error('Invalid time delta.');
    }

    let then;

    switch (unit) {
        case TimeUnit.Years:
            then = new Date();
            then.setFullYear(now.getFullYear() + dt);
            break;
        case TimeUnit.Months:
            then = new Date();
            then.setMonth(now.getMonth() + dt);
            break;
        case TimeUnit.Days:
        case TimeUnit.Hours:
        case TimeUnit.Minutes:
        case TimeUnit.Seconds:
        case TimeUnit.Milliseconds:
            then = new Date(now.getTime() + toMs(dt, unit));
            break;
    }

    if (!then) {
        throw new Error('Cannot compute time from now.');
    }

    return then;
}