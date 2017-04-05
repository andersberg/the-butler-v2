import del from 'del';
import config from './../config';

/**
 * Clean
 * https://github.com/sindresorhus/del
 */
export function clean() {
    return del(config.clean.src);
}

clean.description = `delete files recursively.`;