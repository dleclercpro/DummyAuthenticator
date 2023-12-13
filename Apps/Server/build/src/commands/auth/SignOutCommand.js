"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserErrors_1 = require("../../errors/UserErrors");
const User_1 = __importDefault(require("../../models/User"));
const Logging_1 = require("../../utils/Logging");
const Command_1 = __importDefault(require("../Command"));
class SignOutCommand extends Command_1.default {
    constructor(argument) {
        super('SignOutCommand', argument);
    }
    async doExecute() {
        const { session } = this.argument;
        // User is authenticated: let's grab them in database
        const user = await User_1.default.findByEmail(session.getEmail());
        // The user should exist, otherwise they couldn't have signed in
        if (!user) {
            throw new UserErrors_1.ErrorUserDoesNotExist(session.getEmail());
        }
        // Destroy user session
        await session.delete();
    }
    handleError(err) {
        if (err.code === UserErrors_1.ErrorUserDoesNotExist.code) {
            Logging_1.logger.warn(err.message);
        }
        return err;
    }
}
exports.default = SignOutCommand;
