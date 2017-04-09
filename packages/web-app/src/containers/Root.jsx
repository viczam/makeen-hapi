import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import themes from '../constants/themes';
import Router from './Router';

const Root = ({ store }) => (
  <Provider store={store}>
    <ThemeProvider theme={themes}>
      <Router />
    </ThemeProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
