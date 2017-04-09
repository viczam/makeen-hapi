import React, { PropTypes } from 'react';
import RecoverPassword from '../containers/RecoverPassword';

const RecoverPasswordPage = ({ params }) => <RecoverPassword token={params.token} />;

RecoverPasswordPage.propTypes = {
  params: PropTypes.object.isRequired,
};

export default RecoverPasswordPage;
