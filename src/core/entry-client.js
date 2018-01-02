import ReactDOM from 'react-dom';
import createApp from './createApp';
import createStore from './createStore';

const {store, actions, routes, history} = createStore();

ReactDOM.render(
    createApp({store, routes, actions}),
    document.getElementById('app')
);
