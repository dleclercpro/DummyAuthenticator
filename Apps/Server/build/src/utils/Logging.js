"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const AppConfig_1 = require("../config/AppConfig");
const DEV_OPTIONS = {
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
};
const PROD_OPTIONS = {
    level: 'info',
};
exports.logger = (0, pino_1.default)(AppConfig_1.PROD ? PROD_OPTIONS : DEV_OPTIONS);
