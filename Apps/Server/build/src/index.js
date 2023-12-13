"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SERVER = void 0;
const AppConfig_1 = require("./config/AppConfig"); // Do NOT remove!
const process_1 = __importDefault(require("process"));
const routes_1 = __importDefault(require("./routes"));
const AppServer_1 = __importDefault(require("./models/AppServer"));
const process_2 = require("./libs/process");
const TimeDuration_1 = __importDefault(require("./models/units/TimeDuration"));
const Logging_1 = require("./utils/Logging");
const TimeTypes_1 = require("./types/TimeTypes");
exports.APP_SERVER = new AppServer_1.default();
const execute = async () => {
    Logging_1.logger.debug(`Environment: ${AppConfig_1.ENV}`);
    await exports.APP_SERVER.setup(routes_1.default);
    await exports.APP_SERVER.start();
};
// Shut down gracefully
const TIMEOUT = new TimeDuration_1.default(2, TimeTypes_1.TimeUnit.Second);
const stopAppServer = async () => {
    await exports.APP_SERVER.stop();
    process_1.default.exit(0);
};
const handleStopSignal = async (signal) => {
    Logging_1.logger.warn(`Received stop signal: ${signal}`);
    await Promise.race([stopAppServer(), (0, process_2.killAfterTimeout)(TIMEOUT)]);
};
process_1.default.on('SIGTERM', handleStopSignal);
process_1.default.on('SIGINT', handleStopSignal);
// Run server
execute()
    .catch((err) => {
    Logging_1.logger.fatal(err, `Uncaught error:`);
});
exports.default = execute;
