"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_DIRECTORY = exports.CLIENT_ROOT = exports.CLIENT_PORT = exports.CLIENT_HOST = exports.CLIENT_PROTOCOL = exports.ROOT = exports.PORT = exports.HOST = exports.PROTOCOL = exports.PROD = exports.ENV = void 0;
const libs_1 = require("../libs");
const url_1 = require("../libs/url");
const types_1 = require("../types");
// Environment
exports.ENV = (0, libs_1.getEnvironment)();
exports.PROD = exports.ENV === types_1.Environment.Production;
// Server
exports.PROTOCOL = process.env.PROTOCOL;
exports.HOST = process.env.HOST;
exports.PORT = parseInt(process.env.PORT);
exports.ROOT = `${(0, url_1.createURL)(exports.PROTOCOL, exports.HOST, exports.PORT)}/`;
// Client
exports.CLIENT_PROTOCOL = process.env.CLIENT_PROTOCOL;
exports.CLIENT_HOST = process.env.CLIENT_HOST;
exports.CLIENT_PORT = parseInt(process.env.CLIENT_PORT);
exports.CLIENT_ROOT = (0, url_1.createURL)(exports.CLIENT_PROTOCOL, exports.CLIENT_HOST, exports.CLIENT_PORT);
exports.CLIENT_DIRECTORY = '/client';
