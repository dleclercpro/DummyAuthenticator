import { TimeUnit } from '../types/TimeTypes';

export const SESSION_COOKIE = process.env.SESSION_COOKIE!;
export const SESSION_DURATION = { time: 15, unit: TimeUnit.Minutes };

export const N_PASSWORD_SALT_ROUNDS = 12;
export const PASSWORD_OPTIONS = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
};