import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import store from './store';

const rootElement = document.getElementById('root');

const doRender = (RootComponent) => render(
  <AppContainer>
    <RootComponent store={store} />
  </AppContainer>,
  rootElement,
);

doRender(Root);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root').default; // eslint-disable-line
    doRender(NextRoot);
  });
}
