import path from 'path';
import swPrecache from 'sw-precache';
import config from './../config';
import {DEBUG} from './../env';

/**
 * Service worker
 * https://github.com/GoogleChrome/sw-precache
 */
export function serviceWorker() {
    return swPrecache.write(path.join(config.serviceWorker.rootDirectory, config.serviceWorker.fileName), {
        clientsClaim: true,
        directoryIndex: `index.html`,
        handleFetch: !DEBUG,
        maximumFileSizeToCacheInBytes: 2097152,
        navigateFallback: `/index.html`,
        skipWaiting: true,
        staticFileGlobs: `${config.serviceWorker.rootDirectory}/${config.serviceWorker.staticFileGlobs}`,
        stripPrefix: config.serviceWorker.rootDirectory
    });
}

serviceWorker.description = `Service worker generator using sw-precache`;
