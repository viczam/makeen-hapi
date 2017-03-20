import React, { PropTypes } from 'react';
import Layout from './Layout';

const Hello = ({ user, app }) => (
  <Layout>
    <h1>Hello!</h1>
    <p>Your forgot you password.</p>
    <p>
      Click {' '}
      <a href={`${app.client}/change-password/${user.resetPassword.token}`}>here</a>
      {' '} to recover your password.
    </p>
    <p>ktxbye!</p>
  </Layout>
);

Hello.propTypes = {
  user: PropTypes.shape({
    resetPassword: PropTypes.shape({
      token: PropTypes.string.isRequired,
    }),
  }).isRequired,
  app: PropTypes.shape({
    client: PropTypes.string.isRequired,
  }).isRequired,
};

export default Hello;
