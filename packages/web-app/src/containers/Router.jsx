import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Login from 'modules/user/pages/Login';
import Logout from 'modules/user/pages/Logout';
import Admin from 'modules/admin/pages/index';
import NoMatch from 'components/routing/NoMatch';
import Home from 'modules/website/pages/Home';
import history from 'constants/history';
import SignUpPage from 'modules/user/pages/SignUpPage';
import AuthorizedRoute from './AuthorizedRoute';

const Router = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/signup" component={SignUpPage} />
      <AuthorizedRoute path="/admin" component={Admin} />
      <Route component={NoMatch} />
    </Switch>
  </ConnectedRouter>
);

export default Router;
