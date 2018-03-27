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

export default (core, compiler) => {
    let {cwd, config} = core;

    return async (ctx, next) => {
        let url = ctx.url;

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
            let css = [];
            const providerContext = {
                insertCss: (...styles) => styles.forEach(s => css.push(s._getCss()))
            };

            let error;
            const catchError = (err) => {
                error = err; 
            };

            // components can add properties to the object to store information about the render
            let context = {};
            const renderContent = renderToString(
                <App 
                    location={url} context={context} 
                    store={store} actions={actions} appContext={ctx}
                    routes={routes} ssr providerContext={providerContext} 
                    catchError={catchError} />
            );
            const html = await renderer({
                config,
                manifest,
                content: renderContent,
                data: store.getState(),
                helmet: Helmet.renderStatic(),
                inlineStyle: css.join('').replace(/\n/g, '') || ''
            });

            // context.url exists if <Redirect /> is used
            if (error) {
                ctx.throw(error.status || 500, error.message || 'unknown error');
            }
            else if (context.url) {
                ctx.status = 302;
                ctx.redirect(context.url);
                ctx.body = `Redirecting to ${context.url}`;
            }
            else {
                ctx.res.setHeader('Content-Type', 'text/html; charset=utf-8');
                ctx.body = html;
            }

        }
    }
};
