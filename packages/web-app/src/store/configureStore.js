import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import axiosMiddleware from 'redux-axios-middleware';
// import reduxImmutableStateVariant from 'redux-immutable-state-invariant';
import { composeWithDevTools } from 'redux-devtools-extension';
// import reduxUnhandledAction from 'redux-unhandled-action';
import rootReducer from './rootReducer';
import api from '../api';
import history from '../constants/history';

const isDev = process.env.NODE_ENV === 'development';

const finalCompose = isDev ? composeWithDevTools : compose;

const middlewares = [
  thunkMiddleware,
  axiosMiddleware(api, {
    returnRejectedPromiseOnError: true,
  }),
  routerMiddleware(history),
];

if (isDev) {
  // middlewares.push(reduxImmutableStateVariant());
  middlewares.push(logger);
  // middlewares.push(
  //   reduxUnhandledAction(
  //     (action) => console.error(
  //       `${action.type} didn't lead to creation of a new state object`, action
  //     )
  //   ),
  // );
}

const configureStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    finalCompose(applyMiddleware(...middlewares)),
  );

  if (module.hot) {
    module.hot.accept(
      './rootReducer',
      () => store.replaceReducer(require('./rootReducer').default) // eslint-disable-line
    );
  }

  return store;
};

export default configureStore;
