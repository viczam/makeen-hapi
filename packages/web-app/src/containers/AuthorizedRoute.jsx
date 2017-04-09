import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthorizedRoute = ({ component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      isAuthenticated ? (
        React.createElement(component, props)
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location } // eslint-disable-line
          }}
        />
      )
    )}
  />
);

AuthorizedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ user }) => ({ isAuthenticated: user.isAuthenticated });

export default connect(mapStateToProps, null)(AuthorizedRoute);
