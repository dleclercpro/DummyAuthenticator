"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes"));
const AppConfig_1 = require("./config/AppConfig");
const Logging_1 = require("./utils/Logging");
/* -------------------------------------------------- INSTANCES -------------------------------------------------- */
// Server
const server = (0, express_1.default)();
/* -------------------------------------------------- OPTIONS -------------------------------------------------- */
// Trust first-level proxy
server.set('trust proxy', 1);
/* -------------------------------------------------- MIDDLEWARE -------------------------------------------------- */
// Cookies
server.use((0, cookie_parser_1.default)());
// JSON
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.json());
// GZIP
server.use((0, compression_1.default)());
// API
server.use('/', routes_1.default);
/* -------------------------------------------------- MAIN -------------------------------------------------- */
const main = async () => {
    // Then start listening on given port
    server.listen(AppConfig_1.PORT, () => {
        Logging_1.logger.info(`Server listening in ${AppConfig_1.ENV} mode at: ${AppConfig_1.ROOT}`);
    });
};
// Run
main().catch((err) => {
    Logging_1.logger.error(err);
});
