"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const gh = tslib_1.__importStar(require("@actions/github"));
const fs = tslib_1.__importStar(require("fs"));
function sortObj(inp) {
    return Object.keys(inp).sort().reduce((acc, k) => {
        acc[k] = inp[k];
        return acc;
    }, {});
}
console.log(require('util').inspect({
    cwd: process.cwd(),
    ls: fs.readdirSync(process.cwd()),
    dirLs: fs.readdirSync(process.env.GITHUB_WORKSPACE),
    env: sortObj(process.env),
    ctx: sortObj(gh.context)
}, { colors: true, depth: 100 }));
