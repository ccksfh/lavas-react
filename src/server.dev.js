/**
 * @file server.dev.js
 * @author lavas
 */


import LavasCore from '../core';
import Koa from 'koa';
import clearConsole from 'react-dev-utils/clearConsole';
import {choosePort} from 'react-dev-utils/WebpackDevServerUtils';
import openBrowser from 'react-dev-utils/openBrowser';
import chalk from 'chalk';

const core = new LavasCore(__dirname);
const DEFAULT_PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const isInteractive = process.stdout.isTTY;
let app;
let server;

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
    .then(port => {
        if (port == null) {
          // We have not found a port.
          return;
        }

        core.init('development', true).then(() => startDevServer(port));
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }

        process.exit(1);
    });

function startDevServer(port) {
    app = new Koa();

    core.build()
        .then(() => {
            app.use(core.koaMiddleware());

            server = app.listen(port, () => {

                if (isInteractive) {
                    clearConsole();
                }

                console.log(chalk.cyan(`server started at localhost:${port}`));
                openBrowser(`localhost:${port}`);
            });
        });
}

process.on('unhandledRejection', err => {
  throw err;
});

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        server.close();
        process.exit();
    });
});
