import React from 'react';
import ExternalLayout from 'layouts/External';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Login from '../containers/Login';
import Register from '../containers/Register';

const FormWrapper = styled.div`
  min-height: 90vh;
`;

const LoginOrRegister = (...props) => (
  <ExternalLayout>
    <Helmet
      title="Login or Register"
    />

    <FormWrapper className="ui middle aligned grid">
      <div className="ten wide column centered">
        <div className="ui equal width very relaxed grid">
          <div className="column">
            <h2>Login to your account</h2>
            <Login {...props} />
          </div>

          <div className="ui vertical divider" style={{ left: '50%' }}>or</div>

          <div className="column">
            <h2>Create a new account</h2>
            <Register {...props} />
          </div>
        </div>
      </div>
    </FormWrapper>
  </ExternalLayout>
);

export default LoginOrRegister;
