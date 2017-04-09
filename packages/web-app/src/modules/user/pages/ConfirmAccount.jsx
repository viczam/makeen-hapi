import React, { PropTypes } from 'react';
import ConfirmAccount from '../containers/ConfirmAccount';

const ConfirmAccountPage = ({ params }) => <ConfirmAccount accountId={params.accountId} />;

ConfirmAccountPage.propTypes = {
  params: PropTypes.object.isRequired,
};

export default ConfirmAccountPage;
