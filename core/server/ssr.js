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
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
        let {App, store, actions, routes} = requireFromString(serverBundle)();

        // let plainRoutes = getAllRoutes(routes);

        // if (!~plainRoutes.indexOf(url)) {
        if (/^\/static\//.test(url) || /\/api\//.test(url) || /\..*$/.test(url)) {
            await next();
        }
        else {
            // This context object contains the results of the render
            let context = {};

            // refer to the official website: http://www.material-ui.com/#/get-started/server-rendering
            global.navigator = {userAgent: ctx.headers['user-agent']};
            const muiTheme = getMuiTheme({}, {
                userAgent: ctx.headers['user-agent']
            });
            const renderContent = renderToString(
                <MuiThemeProvider muiTheme={muiTheme}>
                    <App location={url} context={context} store={store} actions={actions} routes={routes} />
                </MuiThemeProvider>
            );
            const html = await renderer({
                config,
                manifest,
                content: renderContent,
                data: store.getState(),
                helmet: Helmet.renderStatic()
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

// function getAllRoutes(routes) {
//     let res = [];

//     for (let route of routes) {
//         res.push(route.path);

//         if (res.children) {
//             res = [...res, ...getAllRoutes(res.children)];
//         }
//     }

//     return res;
// }