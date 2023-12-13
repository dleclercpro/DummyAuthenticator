"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserErrors_1 = require("../../errors/UserErrors");
const Session_1 = __importDefault(require("../../models/Session"));
const Logging_1 = require("../../utils/Logging");
const Command_1 = __importDefault(require("../Command"));
const GetUserCommand_1 = __importDefault(require("../user/GetUserCommand"));
class SignInCommand extends Command_1.default {
    constructor(argument) {
        super('SignInCommand', argument);
    }
    async doExecute() {
        const { email, password, staySignedIn } = this.argument;
        // Try and find user in database
        const user = await new GetUserCommand_1.default({ email }).execute();
        // Authenticate user
        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {
            throw new UserErrors_1.ErrorUserWrongPassword(user);
        }
        // Create session for user
        const session = await Session_1.default.create(user.getEmail(), staySignedIn);
        return { user, session };
    }
    handleError(err) {
        if (err.code === UserErrors_1.ErrorUserDoesNotExist.code ||
            err.code === UserErrors_1.ErrorUserWrongPassword.code) {
            Logging_1.logger.warn(err.message);
        }
        return err;
    }
}
exports.default = SignInCommand;
