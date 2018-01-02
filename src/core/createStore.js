import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
// import {routerReducer, routerMiddleware} from 'react-router-redux';
import reduxThunk from 'redux-thunk';
import reducer from '@/../core/tools/store';
import actions from '@/../core/tools/actions';
import routes from '@/../core/tools/router';

function createAppStore(history, preloadedState = {}) {
  // enhancers
  // eslint-disable-next-line no-underscore-dangle
  let composeEnhancers = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // middlewares
  let middlewares = [];
  // const routeMiddleware = routerMiddleware(history);
  // const middlewares = [
  //     routeMiddleware,
  //     reduxThunk,
  // ];

  const store = createStore(
      // combineReducers({
      //     ...reducers,
      //     router: routerReducer,
      // }),
      reducer,
      preloadedState,
      composeEnhancers(applyMiddleware(...middlewares)),
  );

  return {
      store,
      actions,
      history,
      routes,
  };
}

export default createAppStore;