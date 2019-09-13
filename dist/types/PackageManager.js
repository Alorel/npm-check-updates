"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPackageManager(v) {
    return v === "npm" /* NPM */ || v === "yarn" /* YARN */;
}
exports.isPackageManager = isPackageManager;
