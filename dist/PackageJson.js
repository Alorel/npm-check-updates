"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const lazy_get_decorator_1 = require("lazy-get-decorator");
const path_1 = require("path");
const Dependency_1 = require("./Dependency");
class PackageJson {
    constructor(packageJsonPath, runtime) {
        this.runtime = runtime;
        this.path = path_1.join(process.cwd(), packageJsonPath);
        this.dir = path_1.dirname(this.path);
    }
    get dependencies() {
        const out = [];
        const typeKeys = ['dependencies', 'devDependencies'];
        for (const type of typeKeys) {
            const obj = this.parsed[type];
            if (obj) {
                const dependencyNames = Object.keys(obj);
                if (dependencyNames.length) {
                    for (const depName of dependencyNames) {
                        out.push(new Dependency_1.Dependency(this, type, depName, obj[depName]));
                    }
                }
            }
        }
        return out;
    }
    get parsed() {
        const string = fs.readFileSync(this.path, 'utf8');
        return JSON.parse(string);
    }
    toJSON() {
        return this.parsed;
    }
    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }
}
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], PackageJson.prototype, "dependencies", null);
tslib_1.__decorate([
    lazy_get_decorator_1.LazyGetter()
], PackageJson.prototype, "parsed", null);
exports.PackageJson = PackageJson;
