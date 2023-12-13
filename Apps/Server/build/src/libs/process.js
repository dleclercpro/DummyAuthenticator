"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.killAfterTimeout = void 0;
const time_1 = require("./time");
const kill = () => {
    process.exit(1);
};
const killAfterTimeout = async (timeout) => {
    await (0, time_1.sleep)(timeout);
    await kill();
};
exports.killAfterTimeout = killAfterTimeout;
