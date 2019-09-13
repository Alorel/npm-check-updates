import {isPackageManager, PackageManager} from './PackageManager';

export interface Configuration {
  packageJsons?: string[];

  packageManager?: PackageManager;

  updateAnyVersion?: boolean;
}

export function validateConfiguration(v: Configuration): Configuration {
  if (!v) {
    throw new Error('Unable to resolve configuration');
  } else if (!('packageManager' in v) || !isPackageManager(v.packageManager)) {
    throw new Error(`Invalid package manager: ${String(v.packageManager)}`);
  } else if (typeof v.updateAnyVersion !== 'boolean') {
    throw new Error(`Invalid updateAnyVersion: ${String(v.updateAnyVersion)}`);
  }

  if ('packageJsons' in v) {
    if (typeof <any>v.packageJsons === 'string') {
      v.packageJsons = [<any>v.packageJsons];
    } else if (!Array.isArray(v.packageJsons)) {
      throw new Error('packageJsons must be omitted or an array');
    } else if (!v.packageJsons.length) {
      throw new Error('packageJsons empty');
    }
  } else {
    throw new Error('packageJsons array missing');
  }

  return v;
}
