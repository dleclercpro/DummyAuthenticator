"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDatabase = void 0;
const Observer_1 = require("../utils/Observer");
class MemoryDatabase {
    constructor() {
        this.db = new Map();
        this.onSetObserver = (0, Observer_1.createObserver)();
        this.onDeleteObserver = (0, Observer_1.createObserver)();
    }
    has(id) {
        return this.db.has(id);
    }
    get(id) {
        return this.db.get(id);
    }
    set(record) {
        const prevRecord = this.db.get(record.getId());
        this.db.set(record.getId(), record);
        this.onSetObserver.publish({ prevValue: prevRecord, value: record });
    }
    remove(id) {
        const record = this.db.get(id);
        if (record) {
            this.db.delete(id);
            this.onDeleteObserver.publish({ prevValue: record });
        }
    }
    onSet(listener) {
        return this.onSetObserver.subscribe(listener);
    }
    onDelete(listener) {
        return this.onDeleteObserver.subscribe(listener);
    }
}
exports.MemoryDatabase = MemoryDatabase;
