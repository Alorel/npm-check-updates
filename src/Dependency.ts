import * as http from 'https';
import {RequestOptions} from 'https';
import {LazyGetter} from 'lazy-get-decorator';
import {coerce as semverCoerce, compare as semverCompare, SemVer} from 'semver';
import {EarlyTermination} from './EarlyTermination';
import {isTruthy} from './fns/isTruthy';
import {PackageJson} from './PackageJson';
import {Runtime} from './Runtime';
import {DependencyType} from './types/DependencyType';

const versionCache: { [k: string]: Promise<SemVer[]> } = {};

function fetchVersion(pkg: string): Promise<SemVer[]> {
  return new Promise<SemVer[]>((resolve, reject) => {
    const options: RequestOptions = {
      headers: {
        Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Alorel/npm-check-updates'
      },
      method: 'GET'
    };

    const req = http.request(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`, options, res => {
      const chunks: Buffer[] = [];

      res.on('data', chunk => {
          chunks.push(chunk);
        })
        .once('end', () => {
          if (res.statusCode! >= 400) {
            reject(new Error(`HTTP ${res.statusCode} for ${pkg}.`));

            return;
          }

          try {
            const versionsStr = Object.keys(JSON.parse(Buffer.concat(chunks).toString('utf8')).versions);
            if (!versionsStr.length) {
              reject(new EarlyTermination(`${pkg} has no versions published.`));

              return;
            }

            const versionsObj: SemVer[] = versionsStr
              .map(semverCoerce)
              .filter<SemVer>(<any>isTruthy);
            versionsObj.sort(semverCompare);

            resolve(versionsObj);
          } catch (e) {
            reject(e);
          }
        })
        .once('error', reject);
    });

    req.end();
  });
}

export class Dependency {
  public readonly runtime: Runtime;

  public constructor(
    private readonly packageJson: PackageJson,
    public readonly type: DependencyType,
    public readonly name: string,
    public readonly oldRequiredVersion: string
  ) {
    this.runtime = packageJson.runtime;
  }

  @LazyGetter()
  public get latestVersion$(): Promise<SemVer> {
    return this.versions$
      .then(versions => versions[versions.length - 1]);
  }

  @LazyGetter()
  public get versions$(): Promise<SemVer[]> {
    return versionCache[this.name] || (versionCache[this.name] = fetchVersion(this.name));
  }

  public toString(): string {
    return `${this.name}@${this.oldRequiredVersion}`;
  }
}
