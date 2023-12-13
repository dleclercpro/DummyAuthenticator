"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, argument) {
        this.name = name;
        this.argument = argument;
    }
    async execute() {
        try {
            return await this.doExecute();
        }
        catch (err) {
            throw this.handleError(err);
        }
    }
    handleError(err) {
        return err;
    }
}
exports.default = Command;
