
'use strict';

const path = require('path');
const BUILD_PATH = path.resolve(__dirname, 'dist');
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    build: {
        path: BUILD_PATH,
        publicPath: '/',
        defines: {
            base: {
            }
        },
        /**
         * alias for webpack
         *
         * @type {Object.<string, Object>}
         */
        alias: {
            server: {
                'iscroll/build/iscroll-lite$': path.join(__dirname, 'core/iscroll-ssr.js')
            }
        },
        extend(config, {type, env}) {
        }
    },
    entry: {
        name: 'main',
        ssr: true,
        // mode: 'history',
        base: '/'
        // routes: /^.*$/,
        // pageTransition: {
        //     type: 'slide',
        //     transitionClass: 'slide'
        // }
    },
    router: {
        routes: [
        ]
    },
    manifest: {
        startUrl: '/?fr=app',
        name: 'Lavas',
        shortName: 'Lavas',
        icons: [
            {
                src: 'static/img/icons/android-chrome-192x192.png',
                type: 'image/png',
                size: '192x192'
            }
        ],
        display: 'standalone',
        backgroundColor: '#fff',
        themeColor: '#2874f0'
    },
    serviceWorker: {
        swSrc: path.join(__dirname, 'core/service-worker.js'),
        swDest: path.join(BUILD_PATH, 'service-worker.js'),
        globDirectory: path.basename(BUILD_PATH),
        globPatterns: [
            '**/*.{html,js,css,eot,svg,ttf,woff}'
        ],
        globIgnores: [
            'sw-register.js',
            '**/*.map'
        ],
        dontCacheBustUrlsMatching: /\.\w{8}\./
    }
};
