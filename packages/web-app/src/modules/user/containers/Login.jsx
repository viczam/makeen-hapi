import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import * as actions from '../redux/actionCreators';
import LoginForm from '../forms/Login';
import RedirectIfAuthenticated from './RedirectIfAuthenticated';

class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  handleSubmit = ({ username, password }) => (
    this.props.login(username, password).catch(({ error }) => {
      throw new SubmissionError({ _error: error.response.data.message });
    })
  )

  render() {
    return (
      <RedirectIfAuthenticated>
        <LoginForm onSubmit={this.handleSubmit} />
      </RedirectIfAuthenticated>
    );
  }
}

export default connect(null, actions)(Login);
