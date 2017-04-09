import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actionCreators';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class ConfirmAccount extends Component {
  static propTypes = {
    confirmAccount: PropTypes.func.isRequired,
    accountId: PropTypes.string.isRequired,
  };

  state = {
    didConfirm: false,
    error: null,
  };

  componentDidMount() {
    this.props.confirmAccount(this.props.accountId).then(
      () => this.setState({ didConfirm: true }),
      ({ error }) => {
        this.setState({ error: error.response.data.message });
      },
    );
  }

  render() {
    if (this.state.error) {
      return (
        <div className="ui negative message">
          <i className="close icon" />
          <div className="header">{this.state.error}</div>
          <p>Please make sure you clicked the link from the registration email.</p>
        </div>
      );
    }

    if (this.state.didConfirm) {
      return (
        <div className="ui success message">
          <i className="close icon" />
          <div className="header">Your account has been confirmed.</div>
          <p>You can now login with your registered credentials.</p>
        </div>
      );
    }

    return (
      <RedirectIfAuthenticated>
        <div>Loading...</div>
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(ConfirmAccount);
