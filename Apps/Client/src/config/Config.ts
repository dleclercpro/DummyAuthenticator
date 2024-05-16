import { Environment } from '../constants';
import PACKAGE from '../../package.json';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

// Environment
export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const DEBUG_I18N = false;
export const VERSION = PACKAGE.version;
export const AUTHOR = PACKAGE.author;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api`;

// Server
export const SERVER_RETRY_CONN_MAX_ATTEMPTS = 5;
export const SERVER_RETRY_CONN_MAX_BACKOFF = new TimeDuration(10, TimeUnit.Second);

// Auth
export const DISABLE_AUTH = false;

// Styles
export const APP_THEME = 'dark';

// Speeds
export const SNACKBAR_DURATION = 6000; // ms