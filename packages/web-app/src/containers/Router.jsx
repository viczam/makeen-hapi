import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Login from 'modules/user/pages/Login';
import Logout from 'modules/user/pages/Logout';
import withLayout from 'hoc/withLayout';
import NoMatch from '../components/routing/NoMatch';
import Home from '../modules/website/pages/Home';
import About from '../modules/website/pages/About';
import history from '../constants/history';
import AuthorizedRoute from './AuthorizedRoute';

const Router = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" component={withLayout(Home)} />
      <AuthorizedRoute path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route component={NoMatch} />
    </Switch>
  </ConnectedRouter>
);

export default Router;
