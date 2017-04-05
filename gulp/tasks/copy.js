import { watch, src, dest, series, lastRun } from 'gulp';
import config from './../config';


/**
 * Copy
 */
export function copy() {
    return src(config.copy.src, { since: lastRun(`copy`) })
        .pipe(dest(config.copy.dest))
        .on(`error`, console.error.bind(console));
}

copy.description = `Copy files to build.`;


/**
 * Copy watch
 */
export function copyWatch(next) {
    let watcher = watch(config.copy.src, series(copy));
    watcher.on(`add`, function (path) { console.log(`${path} added.`); });
    watcher.on(`change`, function (path) { console.log(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { console.log(`${path} removed.`); });
    next();
}

copyWatch.description = `Watch copy task.`;