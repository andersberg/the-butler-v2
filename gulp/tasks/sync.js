import config from './../config';
import {init} from 'browser-sync';

/**
 * Sync
 * https://browsersync.io/docs/options
 */
export function sync() {
    return init({
        ui: {
            port: 4001,
            weinre: {
                port: 8080
            }
        },
        https: false,
        files: config.sync.files,
        watchOptions: {},
        server: false,
        proxy: `http://localhost:3000`,
        port: 4000,
        middleware: false,
        serveStatic: [],
        ghostMode: {
            clicks: config.sync.ghostMode.clicks,
            scroll: config.sync.ghostMode.scroll,
            forms: config.sync.ghostMode.forms
        },
        logLevel: `debug`,
        logPrefix: `BS`,
        logConnections: false,
        logFileChanges: true,
        logSnippet: true,
        rewriteRules: false,
        open: `external`,
        browser: `Google Chrome`,
        xip: false,
        hostnameSuffix: false,
        reloadOnRestart: false,
        notify: true,
        scrollProportionally: true,
        scrollThrottle: 0,
        scrollRestoreTechnique: `window.name`,
        scrollElements: [],
        scrollElementMapping: [],
        reloadDelay: 0,
        reloadDebounce: 0,
        plugins: [],
        injectChanges: false,
        startPath: null,
        minify: true,
        host: null,
        codeSync: true,
        timestamps: true,
        clientEvents: [
            `scroll`,
            `scroll:element`,
            `input:text`,
            `input:toggles`,
            `form:submit`,
            `form:reset`,
            `click`
        ],
        socket: {
            socketIoOptions: {
                log: false
            },
            socketIoClientConfig: {
                reconnectionAttempts: 50
            },
            path: `/browser-sync/socket.io`,
            clientPath: `/browser-sync`,
            namespace: `/browser-sync`,
            clients: {
                heartbeatTimeout: 5000
            }
        },
        tagNames: {
            less: `link`,
            scss: `link`,
            css: `link`,
            jpg: `img`,
            jpeg: `img`,
            png: `img`,
            svg: `img`,
            gif: `img`,
            js: `script`
        }
    });
}

sync.description = `Sync changes with browsers.`;
