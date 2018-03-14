import {createStore, applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from '@/../core/common/store';
import actions from '@/../core/common/actions';
import routes from '@/../core/common/router';

function createAppStore(preloadedState = {}) {

    // middlewares
    let middlewares = [
        reduxThunk
    ];

    const store = createStore(
        reducer,
        preloadedState,
        applyMiddleware(...middlewares)
    );

    return {
        store,
        actions,
        routes,
    };
}

export default createAppStore;