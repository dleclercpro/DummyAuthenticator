"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlphanumerical = exports.isAlphabetical = exports.isNumerical = exports.capitalizeFirstLetter = exports.booleanToString = exports.stringToBoolean = void 0;
const stringToBoolean = (str) => {
    const newValue = str ? str.toLowerCase() : '';
    switch (newValue) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw new Error('Invalid boolean string.');
    }
};
exports.stringToBoolean = stringToBoolean;
const booleanToString = (bool) => {
    return bool ? 'true' : 'false';
};
exports.booleanToString = booleanToString;
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const getCharCodes = (str) => {
    return Array.from(str).map(char => char.charCodeAt(0));
};
const isNumerical = (str) => {
    return str !== '' && getCharCodes(str).every(code => code > 47 && code < 58);
};
exports.isNumerical = isNumerical;
const isAlphabetical = (str) => {
    return str !== '' && getCharCodes(str).every(code => ((code > 64 && code < 91) ||
        (code > 96 && code < 123)));
};
exports.isAlphabetical = isAlphabetical;
const isAlphanumerical = (str) => {
    return (0, exports.isAlphabetical)(str) || (0, exports.isNumerical)(str);
};
exports.isAlphanumerical = isAlphanumerical;
