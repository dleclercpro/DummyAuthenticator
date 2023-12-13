"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestMiddleware = void 0;
const Logging_1 = require("../utils/Logging");
const RequestMiddleware = (req, res, next) => {
    const { method, ip, originalUrl: url } = req;
    Logging_1.logger.debug(`[${method}] ${url} (${ip})`);
    next();
};
exports.RequestMiddleware = RequestMiddleware;
