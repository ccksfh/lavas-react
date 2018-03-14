import webpack from 'webpack';
import WebpackConfig from './webpack';
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware';
import ConfigReader from './config-reader';
import {LAVAS_CONFIG_FILE, DEFAULT_ENTRY_NAME} from './constants';
import {writeFileInDev} from './utils/webpack';
import {join, relative} from 'path';

export default class LavasCore {
    constructor(cwd = process.cwd()) {
        // super();
        this.cwd = cwd;
    }

    /**
     * invoked before build & runAfterBuild, do something different in each senario
     *
     * @param {string} env NODE_ENV
     * @param {boolean} isInBuild is in build process
     */
    async init(env, isInBuild) {
        this.env = env;
        this.isDev = env === 'development';
        this.configReader = new ConfigReader(this.cwd, this.env);
        this.koaMiddleware = this.middlewareComposer;

        /**
         * in a build process, we need to read config by scan a directory,
         * but for online server after build, we just read config.json directly
         */
        if (isInBuild) {
            // scan directory
            this.config = await this.configReader.read();
        }
        else {
            // read config from config.json
            // this.config = await this.configReader.readConfigFile();
        }

    }

    async build() {
    }

    middlewareComposer() {
        const composer = require('koa-compose');
        const serve = require('koa-static');
        const Router = require('koa-router');

        const router = new Router();
        const isSsr = this.config.entry.ssr;
        const webpackConfigMod = new WebpackConfig(this.config, this.env);
        const compiler = isSsr
            ? webpack([webpackConfigMod.server(), webpackConfigMod.client()])
            : webpack(webpackConfigMod.client());

        let middlewares = [];

        // middlewares.push(serve(join(this.cwd, relative(this.cwd, this.config.build.path))));

        let webpackDevMiddlewareInstance = devMiddleware(compiler, {
            // noInfo: true,
            publicPath: this.config.build.publicPath,
            reload: true,
            stats: {
                colors: true
            }
        });
        middlewares.push(webpackDevMiddlewareInstance);
        middlewares.push(hotMiddleware(isSsr ? compiler.compilers[1] : compiler));

        if (this.config.entry.ssr) {
            const ssrMiddleware = require('./server/ssr');
            middlewares.push(ssrMiddleware(this, compiler.compilers[0]));
        }
        else {
            router.get('*', (ctx, next) => {
                ctx.type = 'text/html';

                let entry = DEFAULT_ENTRY_NAME + '.html';

                let filepath = join(compiler.outputPath, entry);
                webpackDevMiddlewareInstance.waitUntilValid(() => {
                    ctx.body = compiler.outputFileSystem.readFileSync(filepath) + '';
                });
            });

            // middlewares.push(router.routes());
            // middlewares.push(router.allowedMethods()); 
        }

        router.get('/favicon.ico', (ctx, next) => {
            ctx.status = 200;
            ctx.body = '';
        });

        middlewares.push(router.routes());
        middlewares.push(router.allowedMethods());

        return composer(middlewares);
    }

};
