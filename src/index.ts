import * as gh from '@actions/github';
import * as fs from 'fs';

function sortObj(inp: any): any {
  return Object.keys(inp).sort().reduce(
    (acc: any, k: string) => {
      acc[k] = inp[k];

      return acc;
    },
    {}
  );
}

console.log(require('util').inspect(
  {
    cwd: process.cwd(),
    ls: fs.readdirSync(process.cwd()),
    dirLs: fs.readdirSync(<string>process.env.GITHUB_WORKSPACE),
    env: sortObj(process.env),
    ctx: sortObj(gh.context)
  },
  {colors: true, depth: 100}
));
