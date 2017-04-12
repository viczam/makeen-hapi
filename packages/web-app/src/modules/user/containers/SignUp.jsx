import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import omit from 'lodash/omit';
import * as actions from '../redux/actionCreators';
import SignUpForm from '../forms/SignUp';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class SignUp extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
  };

  state = {
    didSignUp: false,
  };

  handleSubmit = (data) => { // eslint-disable-line
    return this.props.signUp(omit(data, ['confirmPassword']))
      .then(() => {
        this.setState({ didSignUp: true });
      })
      .catch(({ error }) => {
        throw new SubmissionError({ _error: error.response.data.message });
      });
  }

  render() {
    if (this.state.didSignUp) {
      return (
        <div className="ui success message">
          <i className="close icon" />
          <div className="header">Your user registration was successful.</div>
          <p>Please check your email to access the confirmation link.</p>
        </div>
      );
    }

    return (
      <RedirectIfAuthenticated>
        <SignUpForm onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(SignUp);
