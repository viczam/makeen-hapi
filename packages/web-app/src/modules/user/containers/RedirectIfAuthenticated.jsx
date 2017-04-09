import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Redirect from 'react-router-dom/Redirect';
import get from 'lodash/get';

class RedirectIfAuthenticated extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    location: PropTypes.object, // eslint-disable-line
    children: PropTypes.node.isRequired,
  };

  render() {
    const from = get(this.props, 'location.state.from.pathname', '/');

    if (this.props.isAuthenticated) {
      return (
        <Redirect to={from} />
      );
    }

    return this.props.children;
  }
}

const mapStateToProps = ({ user }) => ({
  isAuthenticated: user.isAuthenticated,
});

export default connect(mapStateToProps)(RedirectIfAuthenticated);
