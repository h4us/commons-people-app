// MEMO: refs https://medium.com/@derekfong/nativescript-angular-setup-environment-ts-for-different-environments-631b4c5219b6

import { environment as devEnvironment } from './environment.dev';
import { environment as prodEnvironment } from './environment.prod';
import { environment as testEnvironment } from './environment.test';

export const environment = (() => {
  let envVars;

  if (
    typeof process !== 'undefined' && process &&
      Object.prototype.hasOwnProperty.call(process, 'env') && process.env &&
      Object.prototype.hasOwnProperty.call(process.env, 'environment') && process.env.environment
  ) {
    switch (process.env.environment) {
      case 'prod':
        envVars = prodEnvironment;
        break;
      case 'test':
        envVars = testEnvironment;
        break;
        // TODO: Add additional environment (e.g. uat) if required.
      default:
        envVars = devEnvironment;
    }
  } else {
    envVars = devEnvironment;
  }

  return envVars;
})();
