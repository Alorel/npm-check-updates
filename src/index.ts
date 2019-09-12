import * as core from '@actions/core';
import * as gh from '@actions/github';
import * as fs from 'fs';

core.debug('Debug message');
core.warning('Warning message');

console.log({
  cwd: process.cwd(),
  ls: fs.readdirSync(process.cwd()),
  env: process.env,
  ctx: gh.context
});
