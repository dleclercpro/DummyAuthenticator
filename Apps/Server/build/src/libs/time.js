"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeFromNow = exports.toMs = exports.sleep = void 0;
const TimeTypes_1 = require("../types/TimeTypes");
const sleep = async (duration) => {
    const ms = duration.toMs().getAmount();
    await new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const toMs = (time, unit) => {
    let t; // ms
    switch (unit) {
        case TimeTypes_1.TimeUnit.Day:
            t = time * 24 * 3600 * 1000;
            break;
        case TimeTypes_1.TimeUnit.Hour:
            t = time * 3600 * 1000;
            break;
        case TimeTypes_1.TimeUnit.Minute:
            t = time * 60 * 1000;
            break;
        case TimeTypes_1.TimeUnit.Second:
            t = time * 1000;
            break;
        case TimeTypes_1.TimeUnit.Millisecond:
            t = time;
            break;
        default:
            throw new Error('Invalid time unit.');
    }
    return t;
};
exports.toMs = toMs;
const getTimeFromNow = (dt, unit) => {
    const now = new Date();
    if ((unit === TimeTypes_1.TimeUnit.Year || unit === TimeTypes_1.TimeUnit.Month) && dt % 1 !== 0) {
        throw new Error('Invalid time delta.');
    }
    let then;
    switch (unit) {
        case TimeTypes_1.TimeUnit.Year:
            then = new Date();
            then.setFullYear(now.getFullYear() + dt);
            break;
        case TimeTypes_1.TimeUnit.Month:
            then = new Date();
            then.setMonth(now.getMonth() + dt);
            break;
        case TimeTypes_1.TimeUnit.Day:
        case TimeTypes_1.TimeUnit.Hour:
        case TimeTypes_1.TimeUnit.Minute:
        case TimeTypes_1.TimeUnit.Second:
        case TimeTypes_1.TimeUnit.Millisecond:
            then = new Date(now.getTime() + (0, exports.toMs)(dt, unit));
            break;
    }
    if (!then) {
        throw new Error('Cannot compute time from now.');
    }
    return then;
};
exports.getTimeFromNow = getTimeFromNow;
