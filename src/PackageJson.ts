import * as fs from 'fs';
import {LazyGetter} from 'lazy-get-decorator';
import {dirname, join} from 'path';
import {Dependency} from './Dependency';
import {Runtime} from './Runtime';
import {DependencyType} from './types/DependencyType';

interface IPackageJson {
  dependencies: { [k: string]: string };

  devDependencies: { [k: string]: string };

  [k: string]: any;
}

export class PackageJson {
  public readonly dir: string;

  public readonly path: string;

  public constructor(
    packageJsonPath: string,
    public readonly runtime: Runtime
  ) {
    this.path = join(process.cwd(), packageJsonPath);
    this.dir = dirname(this.path);
  }

  @LazyGetter()
  public get dependencies(): Dependency[] {
    const out: Dependency[] = [];
    const typeKeys: DependencyType[] = ['dependencies', 'devDependencies'];

    for (const type of typeKeys) {
      const obj = this.parsed[type];
      if (obj) {
        const dependencyNames = Object.keys(obj);
        if (dependencyNames.length) {
          for (const depName of dependencyNames) {
            out.push(new Dependency(this, type, depName, obj[depName]));
          }
        }
      }
    }

    return out;
  }

  @LazyGetter()
  public get parsed(): IPackageJson {
    const string = fs.readFileSync(this.path, 'utf8');

    return JSON.parse(string);
  }

  public toJSON(): IPackageJson {
    return this.parsed;
  }

  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}
