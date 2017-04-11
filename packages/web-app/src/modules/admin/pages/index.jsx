import React, { PropTypes } from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';

const Admin = ({ match: { path } }) => (
  <Layout>
    <Route exact path={path} component={Dashboard} />
  </Layout>
);

Admin.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default Admin;
