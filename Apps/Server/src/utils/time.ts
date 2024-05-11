import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

export const getMidnightInUTC = (date: Date) => {
    const midnight = new Date(date);
    midnight.setUTCHours(0, 0, 0, 0); // In UTC time zone

    return midnight;
}

export const getMidnight = (date: Date) => {
    const midnight = new Date(date);
    midnight.setHours(0, 0, 0, 0); // In local time zone

    return midnight;
}

export const getTimeSpentSinceMidnight = (date: Date) => {
    const midnight = getMidnight(date);

    return new TimeDuration(date.getTime() - midnight.getTime(), TimeUnit.Millisecond);
}

export const computeDate = (t: Date, dt: TimeDuration) => {
    return new Date(t.getTime() + dt.toMs().getAmount());
}