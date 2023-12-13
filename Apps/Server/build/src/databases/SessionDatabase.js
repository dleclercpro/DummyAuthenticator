"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryDatabase_1 = require("./MemoryDatabase");
// The session database is a singleton and exists
// in local memory for demonstration purposes
class SessionDatabase extends MemoryDatabase_1.MemoryDatabase {
    constructor() {
        super();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SessionDatabase();
        }
        return this.instance;
    }
}
exports.default = SessionDatabase.getInstance();
