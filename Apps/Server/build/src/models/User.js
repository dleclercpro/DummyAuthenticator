"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const random_words_1 = __importDefault(require("random-words"));
const AuthConfig_1 = require("../config/AuthConfig");
const UserDatabase_1 = __importDefault(require("../databases/UserDatabase"));
class User {
    constructor(email, password, secret) {
        this.email = email;
        this.password = password;
        this.secret = secret;
    }
    stringify() {
        return this.getEmail();
    }
    getId() {
        return this.getEmail();
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getSecret() {
        return this.secret;
    }
    async renewSecret() {
        this.secret = (0, random_words_1.default)();
        await this.save();
    }
    async isPasswordValid(password) {
        return bcrypt.compare(password, this.password);
    }
    async save() {
        UserDatabase_1.default.set(this);
    }
    async delete() {
        UserDatabase_1.default.remove(this.email);
    }
    // STATIC METHODS
    static async findByEmail(email) {
        return UserDatabase_1.default.get(email);
    }
    static async create(email, password) {
        // Generate random secret for user
        const secret = (0, random_words_1.default)();
        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, AuthConfig_1.N_PASSWORD_SALT_ROUNDS);
        // Create new user
        const user = new User(email, hashedPassword, secret);
        // Store user in database
        UserDatabase_1.default.set(user);
        return user;
    }
}
exports.default = User;
