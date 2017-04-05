import { series, parallel } from 'gulp';
import { DEBUG, ENV, DEV, STG, PRD } from './env';
import { clean } from './tasks/clean';
import { transpile, transpileWatch } from './tasks/transpile';
import { copy, copyWatch } from './tasks/copy';
import { sync } from './tasks/sync';
import { configuration, configurationWatch } from './tasks/configuration';
import { favicon } from './tasks/favicon';


/**
 * Export tasks
 */
export { clean };
export { transpile };
export { transpileWatch };
export { copy };
export { copyWatch };
export { sync };
export { configuration };
export { configurationWatch };
export { favicon };
export const start = series(clean, parallel(transpile, transpileWatch, configuration, configurationWatch, copy, copyWatch, favicon));
export const build = series(clean, parallel(transpile, configuration, copy, favicon));


/**
 * Log environment variables
 */
console.log(`DEBUG: ${DEBUG}`);
console.log(`ENV: ${ENV}`);
console.log(`DEV: ${DEV}`);
console.log(`STG: ${STG}`);
console.log(`PRD: ${PRD}`);