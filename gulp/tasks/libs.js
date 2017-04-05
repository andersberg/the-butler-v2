import gulp from 'gulp';
import vulcanize from 'gulp-vulcanize';
import htmlmin from 'gulp-htmlmin';
import config from './../config';

// https://github.com/kangax/html-minifier#options-quick-reference
const htmlminOptions = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
};

export function libs() {
    return gulp.src(config.libs)
        .pipe(vulcanize({
            abspath: ``,
            excludes: [`client/assets/libs/polymer/polymer.html`],
            stripExcludes: false,
            stripComments: true,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(htmlmin(htmlminOptions))
        .pipe(gulp.dest(config.www));
}

libs.description = `Transpile Polymer elements using Babel and PostCss.`;


export function libsWatch() {
    let watcher = gulp.watch(config.libs, gulp.series(libs));
    watcher.on(`add`, function (event) {
        console.log(`File ${event} was added`);
    });
    watcher.on(`change`, function (event) {
        console.log(`File ${event} was ${event.type}`);
    });
    watcher.on(`unlink`, function (event) {
        console.log(`File ${event} was removed`);
    });
}

libsWatch.description = `Watch files and transpile on changes.`;