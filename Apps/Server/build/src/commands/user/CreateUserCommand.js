"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const Command_1 = __importDefault(require("../Command"));
const UserErrors_1 = require("../../errors/UserErrors");
const Logging_1 = require("../../utils/Logging");
class CreateUserCommand extends Command_1.default {
    constructor(argument) {
        super('CreateUserCommand', argument);
    }
    async doExecute() {
        const { email, password } = this.argument;
        // Try and find user in database
        let user = await User_1.default.findByEmail(email);
        // User should not already exist in database
        if (user) {
            throw new UserErrors_1.ErrorUserAlreadyExists(user);
        }
        // Create new user instance
        user = await User_1.default.create(email, password);
        // Report its creation
        Logging_1.logger.info(`New user created: ${user.getEmail()}`);
        return user;
    }
}
exports.default = CreateUserCommand;
