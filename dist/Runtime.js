"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const lazy_get_decorator_1 = require("lazy-get-decorator");
const PackageJson_1 = require("./PackageJson");
const Configuration_1 = require("./types/Configuration");
class Runtime {
    get config() {
        const defaults = {
            packageJsons: ['package.json'],
            packageManager: "npm" /* NPM */,
            updateAnyVersion: false
        };
        if (!this.rootFiles.includes(".npm-update.yml" /* CFG_FILE */)) {
            return defaults;
        }
        else {
            const stringContents = fs.readFileSync(".npm-update.yml" /* CFG_FILE */, 'utf8');
            const cfg = Configuration_1.validateConfiguration(this.yamljs.parse(stringContents));
            cfg.packageJsons = cfg.packageJsons
                .map(p => p.startsWith('./') ? p.substr(2) : p);
            return cfg;
        }
    }
    get packageJsons() {
        return this.config.packageJsons.map(v => new PackageJson_1.PackageJson(v, this));
    }
    get packageManager() {
        return this.config.packageManager;
    }
    get rootFiles() {
        const f = fs.readdirSync(process.cwd(), 'utf8');
        if (!f.length) {
            throw new Error('Working directory empty - did you remember to checkout?');
        }
        return f;
    }
    get updateAnyVersion() {
        return !!this.config.updateAnyVersion;
    }
    get yamljs() {
        return require('yamljs');
    }
}
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Runtime.prototype, "config", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Runtime.prototype, "packageJsons", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Runtime.prototype, "rootFiles", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Runtime.prototype, "updateAnyVersion", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], Runtime.prototype, "yamljs", null);
exports.Runtime = Runtime;
