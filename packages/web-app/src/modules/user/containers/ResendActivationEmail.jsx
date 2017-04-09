import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import * as actions from '../redux/actionCreators';
import ResendActivationEmailForm from '../forms/ResendActivationEmail';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class ResendActivationEmail extends Component {
  static propTypes = {
    resendActivationEmail: PropTypes.func.isRequired,
  };

  state = {
    didResend: false,
  };

  handleSubmit = ({ email }) => { // eslint-disable-line
    return this.props.resendActivationEmail(email)
      .then(() => {
        this.setState({ didResend: true });
      })
      .catch(({ error }) => {
        throw new SubmissionError({ _error: error.response.data.message });
      });
  }

  render() {
    if (this.state.didResend) {
      return (
        <div className="ui success message">
          <i className="close icon" />
          <div className="header">Your activation email has been resent.</div>
          <p>Please check your email to access the confirmation link.</p>
        </div>
      );
    }

    return (
      <RedirectIfAuthenticated>
        <ResendActivationEmailForm onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(ResendActivationEmail);
