/**
 * @file server/index.js
 * @author lavas
 */

"use strict";

import React from 'react';
import {renderToString} from 'react-dom/server';
import renderer from './renderer';
import {join} from 'path';
import requireFromString from 'require-from-string';
import {Helmet} from 'react-helmet';
import {matchRoutes} from '../utils/route';

export default (core, compiler) => {
    let {cwd, config} = core;

    return async (ctx, next) => {
        let {req, res} = ctx;
        let url = req.url;

        console.log(`[Lavas] route middleware: ssr ${url}`);
        
        // get hashed chunks after webpack compiled
        let manifestPath = join(compiler.outputPath, 'webpack-manifest.json');
        let manifest;
        try {
            manifest = JSON.parse(compiler.outputFileSystem.readFileSync(manifestPath) + '');
        }
        catch (e) {
            manifest = {};
        }

        // read server bundle compiled by webpack
        let filepath = join(compiler.outputPath, 'server-bundle.js');
        let serverBundle = compiler.outputFileSystem.readFileSync(filepath) + '';
        let {App, store, actions, routes} = requireFromString(serverBundle)(ctx);

        if (/^\/static\//.test(url) || /\/api\//.test(url) || /\..*$/.test(url)) {
            await next();
        }
        else {
            // This context object contains the results of the render
            let context = {};

            let matched = matchRoutes(routes, url);
            await matched.asyncData({
                dispatch: store.dispatch,
                states: store.getState(),
                actions,
                url
            });

            let css = [];
            const providerContext = {
                insertCss: (...styles) => styles.forEach(s => css.push(s._getCss()))
            };

            const renderContent = renderToString(
                <App 
                    location={url} context={context} 
                    store={store} actions={actions} 
                    routes={routes} ssr providerContext={providerContext} />
            );
            const html = await renderer({
                config,
                manifest,
                content: renderContent,
                data: store.getState(),
                helmet: Helmet.renderStatic(),
                inlineStyle: css.join('').replace(/\n/g, '') || ''
            });

            if (context.url) {
                res.writeHead(302, {
                    Location: context.url
                });
                res.end();
            }
            else {
                ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
                ctx.body = html;
            }

        }
    }
};
