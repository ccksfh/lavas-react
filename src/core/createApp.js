/**
 * @file app.js
 * @author lavas
 */

import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import App from './App';

const supportsHistory = 'pushState' in window.history;

const createApp = ({store, actions, history, routes}) => (
    <Router history={history} forceRefresh={!supportsHistory}>
        <Provider store={store}>
            <App routes={routes} actions={actions} />
        </Provider>
    </Router>
);

export default createApp;
