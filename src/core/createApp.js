/**
 * @file app.js
 * @author lavas
 */

import React from 'react';
import {BrowserRouter, StaticRouter, withRouter} from 'react-router-dom';
import {Provider, connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App';
import createStore from './createStore';

const muiTheme = getMuiTheme({
    primaryColor: '#1976d2'
});

// 基于全局的 state 输出需要的 state
function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
}

let AppComponent = withRouter(connect(mapStateToProps)(App));

export default function createApp() {
    let initialState;
    let Router = StaticRouter;
    let supportsHistory = false;
    if (typeof window !== 'undefined') {
        initialState = window.__INITIAL_STATE__;
        Router = BrowserRouter;
        supportsHistory = 'pushState' in window.history;
    }

    const {store, actions, routes} = createStore(initialState);

    const BasicApp = ({store, actions, routes, location, context}) => (
        <Router forceRefresh={!supportsHistory} location={location} context={context}>
            <Provider store={store}>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <AppComponent routes={routes} actions={actions} />
                </MuiThemeProvider>
            </Provider>
        </Router>
    );

    return {
        App: BasicApp,
        store,
        actions,
        routes
    };

};
