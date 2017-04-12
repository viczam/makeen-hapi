import React, { PropTypes } from 'react';
import Layout from 'makeen-mailer/build/views/Layout';

const Hello = ({ user, account }) => (
  <Layout>
    <h1>Hello!</h1>
    <p>Your account with username {user.username} was created.</p>
    <p>
      Click {' '}
      <a href={`http://localhost:3001/account/${account._id.toString()}/confirm`}>here</a>
      {' '} to confirm your account.
    </p>
    <p>ktxbye!</p>
  </Layout>
);

Hello.propTypes = {
  user: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

export default Hello;
