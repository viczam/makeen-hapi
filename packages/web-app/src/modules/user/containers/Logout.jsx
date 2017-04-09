import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Redirect from 'react-router-dom/Redirect';
import * as actions from '../redux/actionCreators';

class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.logout();
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <Redirect to={'/'} />
      );
    }

    return null;
  }
}

const mapStateToProps = ({ user }) => user;

export default connect(mapStateToProps, actions)(Logout);
