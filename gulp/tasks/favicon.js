import { src, dest, lastRun } from 'gulp';
import favicons from 'gulp-favicons';
import config from './../config';


/**
 * Favicon
 * https://github.com/haydenbleasel/favicons
 * https://developer.mozilla.org/en-US/docs/Web/Manifest
 */
export function favicon() {
    return src(config.favicon.src, { since: lastRun(`transpile`) })
        .pipe(favicons({
            appName: config.favicon.name,
            appDescription: config.favicon.description,
            developerName: `apegroup`,
            developerURL: `http://apegroup.com/`,
            background: config.favicon.background,
            path: `assets/icons`,
            url: `http://apegroup.com/`,
            display: config.favicon.display,
            orientation: config.favicon.orientation,
            start_url: config.favicon.startUrl,
            lang: config.favicon.lang,
            logging: false,
            online: false,
            html: `index.html`,
            theme_color: config.favicon.themeColor,
            pipeHTML: true,
            replace: true,
            icons: {
                android: true,
                appleIcon: false,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                windows: false,
                yandex: false
            }
        }))
        .pipe(dest(config.favicon.dest));
}

favicon.description = `Favicon tasks.`;

