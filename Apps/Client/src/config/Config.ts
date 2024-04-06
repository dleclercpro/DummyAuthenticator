import { Environment } from '../constants';

// Environment
export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const DEBUG_I18N = false;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api`;

// Auth
export const DISABLE_AUTH = false;

// Styles
export const APP_THEME = 'dark';

// Speeds
export const SNACKBAR_DURATION = 6000; // ms