export const enum PackageManager {
  NPM = 'npm',
  YARN = 'yarn'
}

export function isPackageManager(v: any): v is PackageManager {
  return v === PackageManager.NPM || v === PackageManager.YARN;
}
