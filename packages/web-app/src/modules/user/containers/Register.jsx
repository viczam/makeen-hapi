import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import omit from 'lodash/omit';
import * as actions from '../redux/actionCreators';
import RegisterForm from '../forms/Register';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class Register extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired,
  };

  state = {
    didRegister: false,
  };

  handleSubmit = (data) => { // eslint-disable-line
    return this.props.register(omit(data, ['confirmPassword']))
      .then(() => {
        this.setState({ didRegister: true });
      })
      .catch(({ error }) => {
        throw new SubmissionError({ _error: error.response.data.message });
      });
  }

  render() {
    if (this.state.didRegister) {
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
        <RegisterForm onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(Register);
