import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Login from '../containers/Login';

const FormWrapper = styled.div`
  height: 90vh;
`;

export default (...props) => (
  <div>
    <Helmet title="Login" />

    <FormWrapper className="ui middle aligned three column grid">
      <div className="column centered">
        <h2>Login to your account</h2>
        <Login {...props} />
      </div>
    </FormWrapper>
  </div>
);
