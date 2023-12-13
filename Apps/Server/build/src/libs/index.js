"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printJSON = exports.deepCopy = exports.arrayEquals = exports.extractFields = exports.zip = exports.exists = exports.getEnvironment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const types_1 = require("../types");
const getEnvironment = () => {
    const env = process.env.NODE_ENV || types_1.Environment.Development;
    const { error } = dotenv_1.default.config({ path: `.env.${env}` });
    if (error) {
        throw error;
    }
    return env;
};
exports.getEnvironment = getEnvironment;
const exists = (x) => {
    return x !== undefined;
};
exports.exists = exists;
const zip = (a, b) => {
    return a.map((value, i) => [value, b[i]]);
};
exports.zip = zip;
const extractFields = (fields, values) => {
    const existingFields = Object.keys(values);
    const filteredFields = fields.filter(field => existingFields.includes(field));
    return filteredFields.reduce((filteredValues, field) => {
        return {
            ...filteredValues,
            [field]: values[field],
        };
    }, {});
};
exports.extractFields = extractFields;
const arrayEquals = (a, b) => {
    return a.length === b.length && a.every((value, i) => value === b[i]);
};
exports.arrayEquals = arrayEquals;
const deepCopy = (o) => JSON.parse(JSON.stringify(o));
exports.deepCopy = deepCopy;
const printJSON = (json) => {
    console.log(JSON.stringify(json, null, 2));
};
exports.printJSON = printJSON;
