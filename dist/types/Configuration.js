"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PackageManager_1 = require("./PackageManager");
function validateConfiguration(v) {
    if (!v) {
        throw new Error('Unable to resolve configuration');
    }
    else if (!('packageManager' in v) || !PackageManager_1.isPackageManager(v.packageManager)) {
        throw new Error(`Invalid package manager: ${String(v.packageManager)}`);
    }
    else if (typeof v.updateAnyVersion !== 'boolean') {
        throw new Error(`Invalid updateAnyVersion: ${String(v.updateAnyVersion)}`);
    }
    if ('packageJsons' in v) {
        if (typeof v.packageJsons === 'string') {
            v.packageJsons = [v.packageJsons];
        }
        else if (!Array.isArray(v.packageJsons)) {
            throw new Error('packageJsons must be omitted or an array');
        }
        else if (!v.packageJsons.length) {
            throw new Error('packageJsons empty');
        }
    }
    else {
        throw new Error('packageJsons array missing');
    }
    return v;
}
exports.validateConfiguration = validateConfiguration;
