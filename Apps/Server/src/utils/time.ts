import TimeDuration from '../models/units/TimeDuration';

export const sleep = async (duration: TimeDuration) => {
    const ms = duration.toMs().getAmount();

    await new Promise(resolve => setTimeout(resolve, ms));
};

export const computeDate = (t: Date, dt: TimeDuration) => {
    return new Date(t.getTime() + dt.toMs().getAmount());
}