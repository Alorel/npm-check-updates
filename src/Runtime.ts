import * as fs from 'fs';
import {LazyGetter} from 'lazy-get-decorator';
import * as YAML from 'yamljs';
import {PackageJson} from './PackageJson';
import {Configuration, validateConfiguration} from './types/Configuration';
import {PackageManager} from './types/PackageManager';
import {StaticConf} from './types/StaticConf';

export class Runtime {

  @LazyGetter()
  public get config(): Configuration {
    const defaults: Configuration = {
      packageJsons: ['package.json'],
      packageManager: PackageManager.NPM,
      updateAnyVersion: false
    };

    if (!this.rootFiles.includes(StaticConf.CFG_FILE)) {
      return defaults;
    } else {
      const stringContents = fs.readFileSync(StaticConf.CFG_FILE, 'utf8');
      const cfg: Configuration = validateConfiguration(this.yamljs.parse(stringContents));
      cfg.packageJsons = cfg.packageJsons!
        .map(p => p.startsWith('./') ? p.substr(2) : p);

      return cfg;
    }
  }

  @LazyGetter()
  public get packageJsons(): PackageJson[] {
    return this.config.packageJsons!.map(v => new PackageJson(v, this));
  }

  public get packageManager(): PackageManager {
    return this.config.packageManager!;
  }

  @LazyGetter()
  public get rootFiles(): string[] {
    const f = fs.readdirSync(process.cwd(), 'utf8');

    if (!f.length) {
      throw new Error('Working directory empty - did you remember to checkout?');
    }

    return f;
  }

  @LazyGetter()
  public get updateAnyVersion(): boolean {
    return !!this.config.updateAnyVersion;
  }

  @LazyGetter()
  private get yamljs(): typeof YAML {
    return require('yamljs');
  }
}
