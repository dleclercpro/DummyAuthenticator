"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doesFileExist = void 0;
const fs_1 = __importDefault(require("fs"));
const doesFileExist = (filepath) => {
    return fs_1.default.existsSync(filepath);
};
exports.doesFileExist = doesFileExist;
