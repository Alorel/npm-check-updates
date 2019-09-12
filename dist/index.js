"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core = tslib_1.__importStar(require("@actions/core"));
const gh = tslib_1.__importStar(require("@actions/github"));
const fs = tslib_1.__importStar(require("fs"));
core.debug('Debug message');
core.warning('Warning message');
console.log({
    cwd: process.cwd(),
    ls: fs.readdirSync(process.cwd()),
    env: process.env,
    ctx: gh.context
});
