/**
 * @file webpack base config
 * @author lavas
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {join} from 'path';
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
     * @return {Object} webpack base config
     */
    base(buildConfig = {}) {
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

        /* eslint-enable fecs-one-var-per-line */
        let entry = this.config.entry.ssr ? 'core/entry-server.js' : 'core/entry-client.js';
        let baseConfig = {
            entry: {
                main: [
                    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
                    // 'babel-polyfill',
                    join(globals.rootDir, entry)
                ]
            },
            output: {
                filename: 'js/[name].[hash:8].js',
                chunkFilename: 'js/[name].[hash:8].chunk.js',
                path,
                publicPath
            },
            devtool: 'source-map',
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
                    {
                        test: /lazy\.jsx?$/,
                        use: [
                            'bundle-loader?lazy',
                            {
                                loader: 'babel-loader',
                                options: babel
                            }
                        ]
                    },
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
                            'style-loader', 'css-loader', 'stylus-loader'
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
        ];

        let pluginsInDev = [
            new FriendlyErrorsPlugin(),

            new webpack.HotModuleReplacementPlugin(),

            new HtmlWebpackPlugin({
                // minify: this.isProd,
                // hash: true,
                // inject: true,
                template: join(globals.rootDir, 'core/index.html')
            })
        ];

        baseConfig.plugins = [
            ...(this.isProd ? pluginsInProd : pluginsInDev),
            new webpack.DefinePlugin(baseDefines),
            ...basePlugins
        ];

        if (cssExtract) {
            baseConfig.plugins.unshift(
                new ExtractTextPlugin({
                    filename: assetsPath(filenames.css)
                })
            );
        }

        if (typeof extend === 'function') {
            extend.call(this, baseConfig, {
                type: 'base',
                env: this.env
            });
        }

        return baseConfig;
    }

    client() {

    }

    server() {

    }

};
