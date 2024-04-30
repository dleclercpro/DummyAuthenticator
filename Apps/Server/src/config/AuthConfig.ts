import TimeDuration from '../models/units/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';
import { PROD } from './AppConfig';

export const SESSION_COOKIE = process.env.SESSION_COOKIE!;
export const SESSION_DURATION = new TimeDuration(15, TimeUnit.Minute);

export const N_PASSWORD_SALT_ROUNDS = 12;
export const PASSWORD_OPTIONS = !PROD ? {} : {
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
};

export const HOURLY_LOGIN_MAX_ATTEMPTS = 50;

export const GMAIL_USER = process.env.GMAIL_USER as string;
export const GMAIL_PASS = process.env.GMAIL_PASS as string;

export const JWT_TOKEN_LONGEVITY = new TimeDuration(15, TimeUnit.Minute);
export const JWT_TOKEN_SECRETS = {
    ConfirmEmail: process.env.JWT_CONFIRM_EMAIL_TOKEN_SECRET as string,
    ResetPassword: process.env.JWT_RESET_PASSWORD_TOKEN_SECRET as string,
};