import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import * as actions from '../redux/actionCreators';
import RecoverPassword from '../forms/RecoverPassword';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class RecoverPasswordContainer extends Component {
  static propTypes = {
    recoverPassword: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
  };

  state = {
    didRecover: false,
  };

  handleSubmit = ({ password }) => { // eslint-disable-line
    const { token } = this.props;

    return this.props.recoverPassword({ password, token })
      .then(() => {
        this.setState({ didRecover: true });
      })
      .catch(({ error }) => {
        throw new SubmissionError({ _error: error.response.data.message });
      });
  }

  render() {
    if (this.state.didRecover) {
      return (
        <div className="ui success message">
          <i className="close icon" />
          <div className="header">Your password has been recovered.</div>
          <p>You can now login with your newly recovered password.</p>
        </div>
      );
    }

    return (
      <RedirectIfAuthenticated>
        <RecoverPassword onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(RecoverPasswordContainer);
