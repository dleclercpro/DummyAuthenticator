"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const Logging_1 = require("../utils/Logging");
const AppConfig_1 = require("../config/AppConfig");
class AppServer {
    async setup(router) {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        // Enable use of cookies
        this.app.use((0, cookie_parser_1.default)());
        // Enable use of JSON data
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        // Enable HTTP response compression
        this.app.use((0, compression_1.default)());
        // Define server's API endpoints
        this.app.use('/', router);
    }
    getApp() {
        return this.app;
    }
    getServer() {
        return this.server;
    }
    async start() {
        if (!this.server)
            throw new Error('MISSING_SERVER');
        this.server.listen(AppConfig_1.PORT, async () => {
            Logging_1.logger.debug(`App server listening at: ${AppConfig_1.ROOT}`);
        });
    }
    async stop() {
        if (!this.server)
            throw new Error('MISSING_SERVER');
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    Logging_1.logger.fatal(`Could not shut down server gracefully: ${err}`);
                    reject(err);
                }
                Logging_1.logger.info(`Server shut down gracefully.`);
                resolve();
            });
        });
    }
}
exports.default = AppServer;
