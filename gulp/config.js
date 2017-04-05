const config = {
    browsers: [
        `last 2 Chrome versions`,
        `last 2 Firefox versions`,
        `last 2 Edge versions`,
        `last 2 Safari versions`,
        `last 2 Opera versions`,
        `last 2 iOS versions`,
        `last 2 ChromeAndroid versions`,
        `last 2 FirefoxAndroid versions`
    ],
    clean: {
        src: [
            `./build`
        ]
    },
    configuration: {
        src: {
            dev: `./src/+(config)/config.html`,
            stg: `./src/+(config)/config.stg.html`,
            prd: `./src/+(config)/config.prd.html`
        },
        dest: `./build`
    },
    copy: {
        src: [
            `./src/+(assets)/+(fonts|media|libs|resources)/**/*`,
            // `./src/+(assets)/+(libs)/webcomponentsjs/webcomponents-lite.min.js`
        ],
        dest: `./build`
    },
    favicon: {
        src: `./src/assets/icons/favicon.png`,
        name: `Apegroup`,
        description: `Hand coded in Hammarby Sjöstad`,
        background: `#020307`,
        display: `standalone`,
        orientation: `portrait`,
        startUrl: `/`,
        lang: `en-US`,
        themeColor: `#fff`,
        dest: `./build/assets/icons`
    },
    sync: {
        files: [
            `./build/+(app)/**/*.html`,
            `./build/+(app)/**/*.js`,
            `./build/+(admin)/*.html`,
            `./build/+(admin)/*.js`
        ],
        ghostMode: {
            clicks: false,
            scroll: false,
            forms: false
        }
    },
    serviceWorker: {
        rootDirectory: `./build`,
        staticFileGlobs: [
            `**/*.{js,html,css,jpg}`
        ],
        fileName: `sw.js`
    },
    transpile: {
        customMedia: {
            extensions: {
                'tablet': `(min-width: 720px)`,
                'desktop': `(min-width: 1024px)`,
                'lg-desktop': `(min-width: 1440px)`,
            }
        },
        src: [
            `./src/+(app)/**/*.html`,
            `./src/+(admin)/**/*.html`,
            `./src/+(admin)/**/*.js`,
            `!./src/+(app)/**/*.spec.html`,
            `./src/index.html`
        ],
        dest: `./build`
    }
};

export default config;
