"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRange = exports.getAverage = exports.sum = exports.round = exports.equals = void 0;
const EPSILON = Math.pow(10, -9);
const equals = (x, y, epsilon = EPSILON) => {
    return Math.abs(x - y) < epsilon;
};
exports.equals = equals;
const round = (x, decimals) => {
    const pow = Math.pow(10, decimals);
    return Math.round(x * pow) / pow;
};
exports.round = round;
const sum = (arr) => {
    return arr.reduce((count, x) => count + x, 0);
};
exports.sum = sum;
const getAverage = (arr) => {
    return (0, exports.sum)(arr) / arr.length;
};
exports.getAverage = getAverage;
const getRange = (size) => {
    return [...Array(size).keys()];
};
exports.getRange = getRange;
