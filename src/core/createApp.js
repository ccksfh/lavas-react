/**
 * @file app.js
 * @author lavas
 */

import React from 'react';
import {BrowserRouter, StaticRouter, withRouter} from 'react-router-dom';
import {Provider, connect} from 'react-redux';
import {compose} from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App';
import createStore from './createStore';

// 基于全局的 state 输出需要的 state
function mapStateToProps(states) {
    return {
        states
    }
}

function mapDispatchToProps(dispatch) {
}

const enhance = compose(
    withRouter,
    connect(mapStateToProps)
);
const AppComponent = enhance(App);
// const AppComponent = withRouter(connect(mapStateToProps)(App));

export default function createApp(data) {
    let initialState;
    let Router = StaticRouter;
    let supportsHistory = false;
    if (typeof window !== 'undefined') {
        initialState = window.__INITIAL_STATE__;
        Router = BrowserRouter;
        supportsHistory = 'pushState' in window.history;
    }

    const {store, actions, routes} = createStore(initialState);

    const muiTheme = getMuiTheme({
        primaryColor: '#1976d2'
    }, {
        userAgent: data.userAgent
    });

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
