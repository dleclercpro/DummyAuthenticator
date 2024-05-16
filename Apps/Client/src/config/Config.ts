import { Environment } from '../constants';
import PACKAGE from '../../package.json';

// Environment
export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const DEBUG_I18N = false;
export const VERSION = PACKAGE.version;
export const AUTHOR = PACKAGE.author;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api`;

// Server
export const SERVER_RETRY_CONN_MAX_ATTEMPTS = 10;

// Auth
export const DISABLE_AUTH = false;

// Styles
export const APP_THEME = 'dark';

// Speeds
export const SNACKBAR_DURATION = 6000; // ms