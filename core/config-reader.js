/**
 * @file ConfigReader
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

import {readFile, pathExists} from 'fs-extra';
import {join} from 'path';
import glob from 'glob';
import {merge, isArray} from 'lodash';
import {CONFIG_FILE, LAVAS_CONFIG_FILE} from './constants';
// import {distLavasPath} from './utils/path';
// import * as JsonUtil from './utils/json';

function mergeArray(a, b) {
    if (isArray(a)) {
        return a.concat(b);
    }
}

const DEFAULT_CONFIG = {
    buildVersion: null,
    build: {
        publicPath: '/',
        filenames: {
            entry: 'js/[name].[chunkhash:8].js',
            vendor: 'js/vendor.[chunkhash:8].js',
            react: 'js/react.[chunkhash:8].js',
            chunk: 'js/[name].[chunkhash:8].js',
            css: 'css/[name].[contenthash:8].css',
            img: 'img/[name].[hash:8].[ext]',
            fonts: 'fonts/[name].[hash:8].[ext]'
        },
        cssExtract: false,
        cssMinimize: true,
        cssSourceMap: true,
        jsSourceMap: true,
        bundleAnalyzerReport: false,
        compress: false,
        defines: {
            base: {},
            client: {},
            server: {}
        },
        alias: {
            base: {},
            client: {},
            server: {}
        },
        plugins: {
            base: [],
            client: [],
            server: []
        },
        nodeExternalsWhitelist: [],
        watch: null,
        extend: null,
        ssrCopy: []
    },
    babel: {
        presets: ['react'],
        babelrc: false
    },
    entry: [],
    router: {},
    errorHandler: {
        errorPath: '/error'
    },
    middleware: {
        all: [],
        server: [],
        client: []
    },
    serviceWorker: null,
    production: {
        build: {
            cssExtract: true,
            compress: true
        }
    },
    development: {
        build: {
            filenames: {
                entry: 'js/[name].[hash:8].js'
            }
        },
        babel: {
            cacheDirectory: true
        }
    }
};

// /**
//  * config items used in runtime
//  */
// export const RUMTIME_ITEMS = {
//     buildVersion: true,
//     build: {
//         publicPath: true,
//         compress: true
//     },
//     entry: true,
//     middleware: true,
//     router: true,
//     errorHandler: true,
//     manifest: true,
//     serviceWorker: {
//         swDest: true
//     }
// };

export default class ConfigReader {
    constructor(cwd, env) {
        this.cwd = cwd;
        this.env = env;
    }

    /**
     * generate a config object according to config directory and NODE_ENV
     *
     * @return {Object} config
     */
    async read() {
        let config = {};

        // merge with default options
        merge(config, DEFAULT_CONFIG, {
            globals: {
                rootDir: this.cwd
            },
            buildVersion: Date.now()
        }, mergeArray);

        if (config[this.env]) {
            merge(config, config[this.env], mergeArray);
        }

        // read from lavas.config.js
        let singleConfigPath = join(this.cwd, LAVAS_CONFIG_FILE);
        if (await pathExists(singleConfigPath)) {
            console.log('[Lavas] read lavas.config.js.');
            delete require.cache[require.resolve(singleConfigPath)];
            merge(config, await import(singleConfigPath), mergeArray);
        }
        else {
            let configDir = join(this.cwd, 'config');
            let files = glob.sync(
                '**/*.js', {
                    cwd: configDir
                }
            );

            // require all files and assign them to config recursively
            await Promise.all(files.map(async filepath => {
                filepath = filepath.substring(0, filepath.length - 3);

                let paths = filepath.split('/');

                let name;
                let cur = config;
                for (let i = 0; i < paths.length - 1; i++) {
                    name = paths[i];
                    if (!cur[name]) {
                        cur[name] = {};
                    }

                    cur = cur[name];
                }

                name = paths.pop();

                // load config, delete cache first
                let configPath = join(configDir, filepath);
                delete require.cache[require.resolve(configPath)];
                let exportContent = await import(configPath);
                cur[name] = typeof exportContent === 'object' && exportContent !== null
                    ? merge(cur[name], exportContent, mergeArray) : exportContent;
            }));

            let temp = config.env || {};

            // merge config according env
            if (temp[this.env]) {
                merge(config, temp[this.env], mergeArray);
            }
        }

        return config;
    }

    /**
     * in prod mode, read config.json directly instead of analysing config directory
     *
     * @return {Object} config
     */
    // async readConfigFile() {
    //     return JsonUtil.parse(await readFile(distLavasPath(this.cwd, CONFIG_FILE), 'utf8'));
    // }
}
