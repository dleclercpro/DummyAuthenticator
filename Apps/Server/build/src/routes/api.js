"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetSecretController_1 = __importDefault(require("../controllers/GetSecretController"));
const PingController_1 = __importDefault(require("../controllers/PingController"));
const SignInController_1 = __importDefault(require("../controllers/SignInController"));
const SignOutController_1 = __importDefault(require("../controllers/SignOutController"));
const SignUpController_1 = __importDefault(require("../controllers/SignUpController"));
const SessionMiddleware_1 = require("../middleware/SessionMiddleware");
const ApiRouter = (0, express_1.Router)();
// ROUTES
// Authentication
ApiRouter.post(`/sign-up`, [], SignUpController_1.default);
ApiRouter.put(`/sign-in`, [], SignInController_1.default);
ApiRouter.get(`/sign-out`, [SessionMiddleware_1.SessionMiddleware], SignOutController_1.default);
ApiRouter.get('/ping', [SessionMiddleware_1.SessionMiddleware], PingController_1.default);
// Secret
ApiRouter.put('/secret', [SessionMiddleware_1.SessionMiddleware], GetSecretController_1.default);
exports.default = ApiRouter;
