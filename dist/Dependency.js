"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http = tslib_1.__importStar(require("https"));
const lazy_get_decorator_1 = require("lazy-get-decorator");
const semver_1 = require("semver");
const EarlyTermination_1 = require("./EarlyTermination");
const isTruthy_1 = require("./fns/isTruthy");
const versionCache = {};
function fetchVersion(pkg) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8',
                'Cache-Control': 'no-cache',
                'User-Agent': 'Alorel/npm-check-updates'
            },
            method: 'GET'
        };
        const req = http.request(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, options, res => {
            const chunks = [];
            res.on('data', chunk => {
                chunks.push(chunk);
            })
                .once('end', () => {
                if (res.statusCode >= 400) {
                    reject(new Error(`HTTP ${res.statusCode} for ${pkg}.`));
                    return;
                }
                try {
                    const versionsStr = Object.keys(JSON.parse(Buffer.concat(chunks).toString('utf8')).versions);
                    if (!versionsStr.length) {
                        reject(new EarlyTermination_1.EarlyTermination(`${pkg} has no versions published.`));
                        return;
                    }
                    const versionsObj = versionsStr
                        .map(semver_1.coerce)
                        .filter(isTruthy_1.isTruthy);
                    versionsObj.sort(semver_1.compare);
                    resolve(versionsObj);
                }
                catch (e) {
                    reject(e);
                }
            })
                .once('error', reject);
        });
        req.end();
    });
}
class Dependency {
    constructor(packageJson, type, name, oldRequiredVersion) {
        this.packageJson = packageJson;
        this.type = type;
        this.name = name;
        this.oldRequiredVersion = oldRequiredVersion;
        this.runtime = packageJson.runtime;
    }
    get latestVersion$() {
        return this.versions$
            .then(versions => versions[versions.length - 1]);
    }
    get versions$() {
        return versionCache[this.name] || (versionCache[this.name] = fetchVersion(this.name));
    }
    toString() {
        return `${this.name}@${this.oldRequiredVersion}`;
    }
}
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Dependency.prototype, "latestVersion$", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Dependency.prototype, "versions$", null);
exports.Dependency = Dependency;
