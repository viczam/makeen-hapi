import React from 'react';
import Helmet from 'react-helmet';
import ProfileSummary from 'modules/user/containers/ProfileSummary';

const Dashboard = () => (
  <div>
    <Helmet title="Dashboard" />
    <ProfileSummary />
  </div>
);

export default Dashboard;
