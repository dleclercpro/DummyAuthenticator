"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calls_1 = require("../libs/calls");
const HTTPTypes_1 = require("../types/HTTPTypes");
const PingController = async (req, res) => {
    try {
        // Success
        return res.json((0, calls_1.successResponse)());
    }
    catch (err) {
        // Unknown error
        return res
            .status(HTTPTypes_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .send(HTTPTypes_1.HttpStatusMessage.INTERNAL_SERVER_ERROR);
    }
};
exports.default = PingController;
