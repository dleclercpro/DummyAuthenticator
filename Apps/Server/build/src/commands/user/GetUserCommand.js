"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserErrors_1 = require("../../errors/UserErrors");
const Command_1 = __importDefault(require("../Command"));
const User_1 = __importDefault(require("../../models/User"));
class GetUserCommand extends Command_1.default {
    constructor(argument) {
        super('GetUserCommand', argument);
    }
    async doExecute() {
        const { email } = this.argument;
        // Try and find user in database
        const user = await User_1.default.findByEmail(email);
        // User should exist in database
        if (!user) {
            throw new UserErrors_1.ErrorUserDoesNotExist(email);
        }
        return user;
    }
}
exports.default = GetUserCommand;
