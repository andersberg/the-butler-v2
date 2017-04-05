import {src, dest} from 'gulp';
import gulpFont from 'gulp-font';

import config from './../config';

let fontConfig = {
    ext: `.css`,
    fontface: `${config.src}/assets/fonts`,
    relative: `/assets/fonts`,
    dest: `${config.dest}/assets/fonts`,
    embed: [
        `woff`
    ],
    collate: false
};

export function font() {
    return src(`${config.src}/assets/fonts/**/*.{ttf,otf}`, { read: false })
        .pipe(gulpFont(fontConfig))
        .pipe(dest(config.dest));
}

font.description = `Generate web font package from ttf and otf files.`;