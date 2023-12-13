"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createURL = void 0;
const createURL = (protocol, host, port) => {
    const url = `${protocol}://${host}`;
    if (port) {
        return `${url}:${port}`;
    }
    return url;
};
exports.createURL = createURL;
