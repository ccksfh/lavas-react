import React from 'react';
import ReactDOM from 'react-dom';
import createApp from './createApp';

const {App, store, actions, routes} = createApp({
    userAgent: window.navigator.userAgent
});

let renderer = ReactDOM.render;
if (typeof window.__INITIAL_STATE__ !== 'undefined') {
    renderer = ReactDOM.hydrate;
}

ReactDOM.render(
    <App store={store} actions={actions} routes={routes} />,
    document.getElementById('app')
);
