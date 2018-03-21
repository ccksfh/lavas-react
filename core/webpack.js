/**
 * @file webpack base config
 * @author lavas
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import nodeExternals from 'webpack-node-externals';
import values from 'postcss-modules-values';
import {join, sep} from 'path';
import {assetsPath} from './utils/path';

export default class WebpackConfig {
    constructor(config = {}, env) {
        this.config = config;
        this.env = env;
        this.isProd = this.env === 'production';
        this.isDev = this.env === 'development';
    }

    /**
     * generate webpack base config based on lavas config
     *
     * @param {Object} buildConfig build config
     * @param {String} src build client or server
     * @return {Object} webpack base config
     */
    base(buildConfig = {}, src) {
        let {globals, build, babel} = this.config;

        /* eslint-disable fecs-one-var-per-line */
        let {path, publicPath,
            filenames, cssSourceMap, cssMinimize,
            cssExtract, jsSourceMap,
            alias: {base: baseAlias = {}},
            defines: {base: baseDefines = {}},
            extend,
            plugins: {base: basePlugins = []}
        } = Object.assign({}, build, buildConfig);

        let styleUse = [
            'style-loader',
            'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ];
        let lazyUse = [
            {
                test: /lazy\.jsx?$/,
                use: [
                    'bundle-loader?lazy',
                    {
                        loader: 'babel-loader',
                        options: babel
                    }
                ]
            }
        ];
        if (src === 'server') {
            styleUse = [
                'css-loader/locals?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
            ];
            lazyUse = [];
        }

        /* eslint-enable fecs-one-var-per-line */
        let baseConfig = {
            output: {
                path,
                publicPath
            },
            resolve: {
                extensions: ['.js', '.jsx', '.json'],
                alias: Object.assign({
                    '@': globals.rootDir,
                    '$': join(globals.rootDir, '.lavas')
                })
            },
            module: {
                noParse: /es6-promise\.js$/,
                rules: [
                    ...lazyUse,
                    {
                        test: /\.(js|jsx)$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['stage-3']
                            }
                        },
                        exclude: /node_modules/
                    },
                    {
                        test: /\.(css|styl)$/,
                        use: [
                            ...styleUse,
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    plugins: []
                                }
                            }
                        ]
                    },
                    {
                        test: /\.styl$/,
                        use: [
                            'stylus-loader'
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: assetsPath(filenames.img)
                        }
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: assetsPath(filenames.fonts)
                        }
                    }
                ]
            }
        };

        let pluginsInProd = [
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false
            //     },
            //     sourceMap: jsSourceMap
            // }),
            // new OptimizeCSSPlugin({
            //     cssProcessorOptions: {
            //         safe: true
            //     }
            // }),
            // new SWRegisterWebpackPlugin({
            //     filePath: resolve(__dirname, 'templates/sw-register.js'),
            //     prefix: publicPath
            // })
        ];

        let pluginsInDev = [
            new FriendlyErrorsPlugin()
        ];

        baseConfig.plugins = [
            ...(this.isProd ? pluginsInProd : pluginsInDev),
            new webpack.DefinePlugin(baseDefines),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.LoaderOptionsPlugin({
                options: {
                    postcss: () => [value]
                }
            }),
            ...basePlugins
        ];

        // if (cssExtract) {
        //     baseConfig.plugins.unshift(
        //         new ExtractTextPlugin({
        //             filename: assetsPath(filenames.css)
        //         })
        //     );
        // }

        if (typeof extend === 'function') {
            extend.call(this, baseConfig, {
                type: 'base',
                env: this.env
            });
        }

        return baseConfig;
    }

    /**
     * generate client base config based on lavas config
     *
     * @param {Object} buildConfig build config
     * @return {Object} client base config
     */
    client(buildConfig = {}) {
        let {buildVersion, globals, build, manifest, serviceWorker: workboxConfig, entry: {ssr}} = this.config;

        /* eslint-disable fecs-one-var-per-line */
        let {publicPath, filenames, cssSourceMap, cssMinimize, cssExtract,
            jsSourceMap, bundleAnalyzerReport, extend,
            defines: {client: clientDefines = {}},
            alias: {client: clientAlias = {}},
            plugins: {client: clientPlugins = []}} = Object.assign({}, build, buildConfig);
        /* eslint-enable fecs-one-var-per-line */

        let outputFilename = filenames.entry;
        let clientConfig = merge(this.base(buildConfig, 'client'), {
            entry: {
                main: [
                    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
                    join(globals.rootDir, './core/entry-client')
                ]
            },
            output: {
                filename: assetsPath(outputFilename),
                chunkFilename: assetsPath(filenames.chunk)
            },
            resolve: {
                alias: clientAlias
            },
            // module: {
            //     rules: styleLoaders({
            //         cssSourceMap,
            //         cssMinimize,
            //         cssExtract
            //     })
            // },
            devtool: jsSourceMap ? (this.isDev ? 'cheap-module-eval-source-map' : 'nosources-source-map') : false,
            plugins: [
                // new webpack.HotModuleReplacementPlugin(),

                // http://vuejs.github.io/vue-loader/en/workflow/production.html
                new webpack.DefinePlugin(Object.assign({
                    'process.env.REACT_ENV': '"client"',
                    'process.env.NODE_ENV': `"${this.env}"`
                }, clientDefines)),

                new ManifestPlugin({
                    publicPath,
                    fileName: 'webpack-manifest.json',
                    // 把 seed 改成 {}，避免 watch mode 情况下被删减的 chunk 还保留在 manifest 里。等待 plugin 更新
                    // https://github.com/danethurber/webpack-manifest-plugin/issues/127
                    generate: (seed, files) => 
                        files.reduce((manifest, { name, path }) => ({ ...manifest, [name]: path }), {}),
                    sort: (a, b) => {
                        let points = x => {
                            if (x.name.indexOf('manifest') !== -1) {
                                return 4;
                            }
                            if (x.name.indexOf('vender') !== -1) {
                                return 3;
                            }
                            if (x.name.indexOf('react') !== -1) {
                                return 2;
                            }
                            return 1;
                        };
                        return points(a) > points(b) ? -1 : 1;
                    },
                    // filter: chunk => !/\/fonts\//.test(chunk.path)
                    filter: chunk => !/\/fonts\//.test(chunk.path) && !/[0-9]\..*\.js$/.test(chunk.path)
                }),

                // split vendor js into its own file
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    filename: assetsPath(filenames.vendor),
                    minChunks(module, count) {
                        // any required modules inside node_modules are extracted to vendor
                        return module.resource
                            && /\.(js|jsx|css|styl)$/.test(module.resource)
                            && module.resource.indexOf('node_modules') >= 0;
                    }
                }),

                // split react combo into react chunk
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'react',
                    filename: assetsPath(filenames.react),
                    minChunks(module, count) {
                        // On Windows, context will be seperated by '\',
                        // then paths like '\node_modules\vue\' cannot be matched because of '\v'.
                        // Transforming into '::node_modules::vue::' can solve this.
                        let context = module.context;
                        let matchContext = context ? context.split(sep).join('::') : '';
                        let targets = ['react', 'react-router-dom', 'react-dom', 'redux', 'react-redux', 'redux-thunk', 'react-transition-group'];
                        let npmRegExp = new RegExp(targets.join('|'), 'i');
                        let cnpmRegExp
                            = new RegExp(targets.map(t => `_${t}@\\d\\.\\d\\.\\d@${t}`).join('|'), 'i');

                        return context
                            && matchContext.indexOf('node_modules') !== -1
                            && (npmRegExp.test(matchContext) || cnpmRegExp.test(matchContext));
                    }
                }),

                // extract webpack runtime and module manifest to its own file in order to
                // prevent vendor hash from being updated whenever app bundle is updated
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'manifest',
                    chunks: ['react']
                }),

                // // add custom plugins in client side
                // ...clientPlugins
            ]
        });

        if (!ssr) {
            clientConfig.plugins.push(new HtmlWebpackPlugin({
                // minify: this.isProd,
                // hash: true,
                // inject: true,
                template: join(globals.rootDir, 'core/index.html')
            }));
        }

        // // Use workbox in prod mode.
        // if (this.isProd && workboxConfig) {
        //     if (workboxConfig.appshellUrls && workboxConfig.appshellUrls.length) {
        //         workboxConfig.templatedUrls = {};
        //         workboxConfig.appshellUrls.forEach(appshellUrl => {
        //             workboxConfig.templatedUrls[appshellUrl] = `${buildVersion}`;
        //         });
        //     }
        //     clientConfig.plugins.push(new WorkboxWebpackPlugin(workboxConfig));
        // }

        // // Copy static files to /dist.
        // let copyList = [{
        //     from: join(globals.rootDir, ASSETS_DIRNAME_IN_DIST),
        //     to: ASSETS_DIRNAME_IN_DIST,
        //     ignore: ['*.md']
        // }];
        // // Copy workbox.dev|prod.js from node_modules manually.
        // if (this.isProd && workboxConfig) {
        //     copyList = copyList.concat(
        //         getWorkboxFiles(this.isProd)
        //             .map(f => {
        //                 return {
        //                     from: join(WORKBOX_PATH, `../${f}`),
        //                     to: assetsPath(`js/${f}`)
        //                 };
        //             })
        //     );
        // }
        // clientConfig.plugins.push(new CopyWebpackPlugin(copyList));

        // // Bundle analyzer.
        // if (bundleAnalyzerReport) {
        //     clientConfig.plugins.push(
        //         new BundleAnalyzerPlugin(Object.assign({}, bundleAnalyzerReport)));
        // }

        // if (typeof extend === 'function') {
        //     extend.call(this, clientConfig, {
        //         type: 'client',
        //         env: this.env
        //     });
        // }

        return clientConfig;
    }

    /**
     * generate webpack server config based on lavas config
     *
     * @param {Object} buildConfig build config
     * @return {Object} webpack server config
     */
    server(buildConfig = {}) {
        /* eslint-disable fecs-one-var-per-line */
        let {extend, nodeExternalsWhitelist = [],
            defines: {server: serverDefines = {}},
            alias: {server: serverAlias = {}},
            plugins: {server: serverPlugins = []}
        } = this.config.build;
        /* eslint-enable fecs-one-var-per-line */

        let serverConfig = merge(this.base(buildConfig, 'server'), {
            target: 'node',
            entry: {
                main: join(this.config.globals.rootDir, './core/entry-server')
            },
            output: {
                filename: 'server-bundle.js',
                library: 'serverBundle',
                libraryTarget: 'commonjs2'
            },
            resolve: {
                alias: serverAlias
            },
            // module: {
            //     /**
            //      * Generally in ssr, we don't need any loader to handle style files,
            //      * but some UI library such as vuetify will require style files directly in JS file.
            //      * So we still add some relative loaders here.
            //      */
            //     rules: styleLoaders({
            //         cssSourceMap: false,
            //         cssMinimize: false,
            //         cssExtract: false
            //     })
            // },
            // https://webpack.js.org/configuration/externals/#externals
            // https://github.com/liady/webpack-node-externals
            externals: nodeExternals({
                // do not externalize CSS files in case we need to import it from a dep
                // whitelist: [...nodeExternalsWhitelist, /\.(css|jsx)$/]
            }),
            plugins: [
                new webpack.DefinePlugin(Object.assign({
                    'process.env.REACT_ENV': '"server"',
                    'process.env.NODE_ENV': `"${this.env}"`
                }, serverDefines)),
                // add custom plugins in server side
                ...serverPlugins
            ]
        });

        // if (typeof extend === 'function') {
        //     extend.call(this, serverConfig, {
        //         type: 'server',
        //         env: this.env
        //     });
        // }

        return serverConfig;
    }

};
