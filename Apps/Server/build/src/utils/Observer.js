"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObserver = void 0;
const createObserver = () => {
    let listeners = [];
    // Remove given listener from list
    const unsubscribe = (listener) => {
        listeners = listeners.filter(l => l !== listener);
    };
    // Add new listener to list
    const subscribe = (listener) => {
        listeners.push(listener);
        // Return function to remove subscriber that was just added
        return () => unsubscribe(listener);
    };
    // Notify all listeners of event
    const publish = (event) => {
        listeners.forEach(l => l(event));
    };
    return { subscribe, publish };
};
exports.createObserver = createObserver;
