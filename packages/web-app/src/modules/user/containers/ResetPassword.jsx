import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import * as actions from '../redux/actionCreators';
import ResetPasswordForm from '../forms/ResetPassword';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class ResetPasswordContainer extends Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
  };

  state = {
    didReset: false,
  };

  handleSubmit = ({ usernameOrEmail }) => { // eslint-disable-line
    return this.props.resetPassword(usernameOrEmail)
      .then(() => {
        this.setState({ didReset: true });
      })
      .catch(({ error }) => {
        throw new SubmissionError({ _error: error.response.data.message });
      });
  }

  render() {
    if (this.state.didReset) {
      return (
        <div className="ui success message">
          <i className="close icon" />
          <div className="header">Your password has been reset.</div>
          <p>Please check your email to access the change password link.</p>
        </div>
      );
    }

    return (
      <RedirectIfAuthenticated>
        <ResetPasswordForm onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(ResetPasswordContainer);
