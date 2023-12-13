"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvironment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const types_1 = require("../types");
const file_1 = require("./file");
const ENVIRONMENTS = Object.values(types_1.Environment);
const loadEnvironment = () => {
    const env = process.env.ENV;
    if (env === undefined) {
        console.error(`Missing environment variable.`);
        process.exit(-1);
    }
    if (!ENVIRONMENTS.includes(env)) {
        console.error(`Invalid environment variable: ${env}`);
        process.exit(-1);
    }
    const filepath = path_1.default.resolve(process.cwd(), `.env.${env}`);
    if (!(0, file_1.doesFileExist)(filepath)) {
        console.error(`Missing environment variables file: .env.${env}`);
        process.exit(-1);
    }
    dotenv_1.default.config({ path: filepath });
    console.debug(`Loaded environment: ${env}\n`);
    return env;
};
exports.loadEnvironment = loadEnvironment;
