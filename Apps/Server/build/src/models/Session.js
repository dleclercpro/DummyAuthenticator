"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const AuthConfig_1 = require("../config/AuthConfig");
const SessionDatabase_1 = __importDefault(require("../databases/SessionDatabase"));
const time_1 = require("../libs/time");
const Logging_1 = require("../utils/Logging");
class Session {
    constructor(id, email, expirationDate, staySignedIn) {
        this.id = id;
        this.email = email;
        this.expirationDate = expirationDate;
        this.staySignedIn = staySignedIn;
    }
    stringify() {
        return this.getId();
    }
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getExpirationDate() {
        return this.expirationDate;
    }
    async extend(time, unit) {
        this.expirationDate = new Date(this.expirationDate.getTime() + (0, time_1.toMs)(time, unit));
        await this.save();
        Logging_1.logger.debug(`Extended session of user: ${this.email}`);
    }
    async save() {
        SessionDatabase_1.default.set(this);
    }
    async delete() {
        SessionDatabase_1.default.remove(this.id);
        Logging_1.logger.debug(`Deleted session of user: ${this.email}`);
    }
    // STATIC METHODS
    static generateId() {
        return crypto_1.default.randomUUID();
    }
    static async findById(id) {
        return SessionDatabase_1.default.get(id);
    }
    static async create(email, staySignedIn = false) {
        let id = '';
        // Find a unique, non-existent ID for the new session 
        while (!id || await Session.findById(id)) {
            id = Session.generateId();
        }
        // Generate default expiration date for session
        const expirationDate = new Date(new Date().getTime() + (0, time_1.toMs)(AuthConfig_1.SESSION_DURATION.time, AuthConfig_1.SESSION_DURATION.unit));
        // Create session
        const session = new Session(id, email, expirationDate, staySignedIn);
        // Store session in database
        await session.save();
        Logging_1.logger.debug(`Created new session for user: ${email}`);
        return session;
    }
}
exports.default = Session;
