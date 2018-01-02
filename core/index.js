import webpack from 'webpack';
import WebpackConfig from './webpack';
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware';
import ConfigReader from './config-reader';
import {LAVAS_CONFIG_FILE} from './constants';
import {join} from 'path';

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
        const webpackConfig = new WebpackConfig(this.config, 'development').base();
        const compiler = webpack(webpackConfig);

        let middlewares = [];

        let webpackDevMiddlewareInstance = devMiddleware(compiler, {
            noInfo: true,
            publicPath: webpackConfig.output.publicPath,
            reload: true,
            stats: {
                colors: true
            }
        });
        middlewares.push(webpackDevMiddlewareInstance);
        middlewares.push(hotMiddleware(compiler));

        if (this.config.entry.ssr) {
            middlewares.push(this.ssrMiddleware());

            // /*
            // 首先要弄清楚流程：
            // 请求到达 
            // */
            // router.get('*', (ctx, next) => {
            //     const renderToString = require('react-dom/server');
            //     const StaticRouter = require('react-router').StaticRouter;
            //     const store = require(join(this.cwd, 'core/createStore')).store;
            //     const App = require(join(this.cwd, 'core/App'));

            //     const {res, req} = ctx;
            //     // This context object contains the results of the render
            //     const context = {};

            //     const html = renderToString(
            //         <StaticRouter location={req.url} context={context}>
            //             <App />
            //         </StaticRouter>
            //     );

            //     state = store.getState();

            //     window.__INITIAL_STATE__ = state;

            //     if (context.url) {
            //         res.writeHead(302, {
            //             Location: context.url
            //         });
            //         res.end();
            //     }
            //     else {
            //         res.write(html)
            //         res.end();
            //     }
            // });
        }
        else {
            router.get('*', (ctx, next) => {
                ctx.type = 'text/html';

                // let entry = ctx.url.replace(/^\//, '');
                let entry = 'index.html';

                let filepath = join(compiler.outputPath, entry);
                webpackDevMiddlewareInstance.waitUntilValid(() => {
                    ctx.body = compiler.outputFileSystem.readFileSync(filepath) + '';
                });
            });
        }

        middlewares.push(router.routes());
        middlewares.push(router.allowedMethods());  

        return composer(middlewares);
    }

    ssrMiddleware() {
        let {config, cwd} = this;
        return async function (req, res, next) {
            let url = req.url;
            console.log(`[Lavas] route middleware: ssr ${url}`);

            const react = require('react');
            const renderToString = require('react-dom/server').renderToString;
            const StaticRouter = require('react-router').StaticRouter;
            const App = require(join(cwd, 'core/App'));

            // This context object contains the results of the render
            const context = {};
            // render to string
            const html = renderToString(
                <StaticRouter location={url} context={context}>
                    <App />
                </StaticRouter>
            );
            console.log(html)

            window.__INITIAL_STATE__ = {initial: 1};

            if (context.url) {
                res.writeHead(302, {
                    Location: context.url
                });
                res.end();
            }
            else {
                res.write(html)
                res.end();
            }
        };
    }

};
