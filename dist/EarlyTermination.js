"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const marker = Symbol('EarlyTermination');
class EarlyTermination extends Error {
    static is(v) {
        return !!v && !!v[marker];
    }
}
exports.EarlyTermination = EarlyTermination;
Object.defineProperty(EarlyTermination.prototype, marker, { value: true });
