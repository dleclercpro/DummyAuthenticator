import { loadEnvironment } from '../utils/env';
import { createURL } from '../utils/url';
import { Environment } from '../types';

// Environment
export const ENV = loadEnvironment();
export const PROD = ENV === Environment.Production;

// Server
export const PROTOCOL = process.env.PROTOCOL!;
export const HOST = process.env.HOST!;
export const PORT = parseInt(process.env.PORT!);
export const ROOT = `${createURL(PROTOCOL, HOST, PORT)}/`;

// Client
export const CLIENT_PROTOCOL = process.env.CLIENT_PROTOCOL!;
export const CLIENT_HOST = process.env.CLIENT_HOST!;
export const CLIENT_PORT = parseInt(process.env.CLIENT_PORT!);
export const CLIENT_ROOT = createURL(CLIENT_PROTOCOL, CLIENT_HOST, CLIENT_PORT);