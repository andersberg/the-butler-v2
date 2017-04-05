import { watch, src, dest, series, lastRun } from 'gulp';
import { DEBUG } from './../env';
import babel from 'gulp-babel';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import polymerPostcss from 'gulp-polymer-postcss';
import config from './../config';
import { PolymerProject } from 'polymer-build';
import gulpif from 'gulp-if';


const polymerProject = new PolymerProject({});


/**
 * Transpile
 * https://github.com/postcss/autoprefixer
 * https://github.com/postcss/postcss-custom-media
 * https://github.com/Polymer/polymer-build
 * https://github.com/babel/gulp-babel
 * https://github.com/hparra/gulp-rename
 */
export function transpile() {
    return src(config.transpile.src, { since: lastRun(`transpile`) })
        .pipe(polymerPostcss([
            autoprefixer(config.browsers),
            customMedia(config.transpile.customMedia)
        ]))
        .pipe(polymerProject.splitHtml())
        .pipe(gulpif(/\.js$/, babel({
            presets: {
                "minified": !DEBUG,
                "comments": DEBUG,
                "presets": [
                    [`env`, {
                        "targets": {
                            "browsers": config.browsers
                        }
                    }]
                ]
            }
        })))
        // gulpif(/\.html$/, htmlMinifier()),
        .pipe(polymerProject.rejoinHtml())
        .pipe(dest(config.transpile.dest))
        .on(`error`, console.error.bind(console));
}

transpile.description = `Transpile Polymer elements.`;


/**
 * Transpile watch
 */
export function transpileWatch(next) {
    let watcher = watch(config.transpile.src, series(transpile));
    watcher.on(`add`, function (path) { console.log(`${path} added.`); });
    watcher.on(`change`, function (path) { console.log(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { console.log(`${path} removed.`); });
    next();
}

transpileWatch.description = `Watch transpile Polymer elements.`;