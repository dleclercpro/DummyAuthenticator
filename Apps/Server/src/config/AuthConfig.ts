import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const SESSION_COOKIE = process.env.SESSION_COOKIE!;
export const SESSION_DURATION = new TimeDuration(15, TimeUnit.Minute);

export const N_PASSWORD_SALT_ROUNDS = 12;
export const PASSWORD_OPTIONS = {
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
};