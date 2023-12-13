"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPairIndices = exports.getUnevenRange = exports.getEvenRange = exports.getRange = exports.roundDigits = void 0;
const roundDigits = (x, n) => {
    const power = Math.pow(10, n);
    return Math.round(x * power) / power;
};
exports.roundDigits = roundDigits;
const getRange = (x) => {
    return [...Array(x).keys()];
};
exports.getRange = getRange;
const getEvenRange = (to) => {
    return (0, exports.getRange)(to).filter(i => i % 2 === 0);
};
exports.getEvenRange = getEvenRange;
const getUnevenRange = (to) => {
    return (0, exports.getRange)(to).filter(i => i % 2 !== 0);
};
exports.getUnevenRange = getUnevenRange;
const getPairIndices = (n) => {
    let indices = [];
    if (n <= 0) {
        throw new Error('Invalid # of pairs.');
    }
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            indices = [...indices, [i, j]];
        }
    }
    return indices;
};
exports.getPairIndices = getPairIndices;
