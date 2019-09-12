import * as core from '@actions/core';

console.log(core.getInput('gh_token', {required: true}));
