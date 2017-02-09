import React, { PropTypes } from 'react';
import Layout from './Layout';

const Hello = ({ user, account, app, transportConfig }) => (
  <Layout transportConfig={transportConfig}>
    <h1>Hello!</h1>
    <p>Your account with username {user.username} was created.</p>
    <p>
      Click {' '}
      <a href={`${app.api}/account/${account._id.toString()}/confirm`}>here</a>
      {' '} to confirm your account.
    </p>
    <p>ktxbye!</p>
  </Layout>
);

Hello.propTypes = {
  user: PropTypes.object,
  account: PropTypes.object,
  transportConfig: PropTypes.object,
  app: PropTypes.object,
};

export default Hello;
