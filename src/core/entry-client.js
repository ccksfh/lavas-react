import React from 'react';
import ReactDOM from 'react-dom';
import createApp from './createApp';

const {App, store, actions, routes} = createApp();

ReactDOM.render(
    <App store={store} actions={actions} routes={routes} />,
    document.getElementById('app')
);
