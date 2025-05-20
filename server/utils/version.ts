import * as fs from 'fs';
import * as yaml from 'js-yaml';

/**
 * This is primarily copied from the logic used in https://github.com/hmcts/nodejs-healthcheck, to fetch the version.
 * See https://github.com/hmcts/nodejs-healthcheck/blob/ee763e76bc8774eded8155da918416bcad0adbe3/healthcheck/versionFile.js.
 */

interface VersionFileProps {
  version: string;
  number?: string;
  commit?: string;
  date?: string;
}

let defaultObj: VersionFileProps;

const versionFile = () => {
  const versionFilePath = `${process.env.NODE_PATH ?? '.'}/version`;

  defaultObj = {
    version: process.env.PACKAGES_VERSION ?? 'unknown',
    commit: 'unknown',
    date: 'unknown',
  };

  try {
    const versionFileText = fs.readFileSync(versionFilePath, { encoding: 'utf8' });
    return yaml.load(versionFileText);
  } catch (err: any) {
    // do nothing with the error and return default
    return defaultObj;
  }
};

export const version = (): string => {
  const props = versionFile() as VersionFileProps;
  if (props.version) {
    if (props.number) {
      return props.version + '-' + props.number;
    } else {
      return props.version;
    }
  } else {
    return defaultObj.version;
  }
};
