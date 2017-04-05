import { watch, src, dest, series, lastRun } from 'gulp';
import { ENV } from './../env';
import rename from 'gulp-rename';
import config from './../config';

/**
 * Configuration
 * https://github.com/hparra/gulp-rename
 */
export function configuration() {
    return src(config.configuration.src[ENV.toLowerCase()], { since: lastRun(`configuration`) })
        .pipe(rename(`/config/config.html`))
        .pipe(dest(config.configuration.dest));
}

configuration.description = `Create configuration file.`;


/**
 * Configuration watch
 */
export function configurationWatch(next) {
    let watcher = watch(config.configuration.src[ENV.toLowerCase()], series(configuration));
    watcher.on(`add`, function (path) { console.log(`${path} added.`); });
    watcher.on(`change`, function (path) { console.log(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { console.log(`${path} removed.`); });
    next();
}

configurationWatch.description = `Watch configuration file.`;