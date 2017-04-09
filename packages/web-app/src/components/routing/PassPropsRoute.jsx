import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';

const PassPropsRoute = ({ component: Comp, passProps, ...props }) => (
  <Route
    {...props}
    render={(matchedProps) => <Comp {...passProps} {...matchedProps} />}
  />
);

PassPropsRoute.propTypes = {
  component: PropTypes.func,
  passProps: PropTypes.object,
};

PassPropsRoute.defaultProps = {
  passProps: {},
};

export default PassPropsRoute;
