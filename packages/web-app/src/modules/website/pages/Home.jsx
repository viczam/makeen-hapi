import React from 'react';
import Link from 'react-router-dom/Link';
import Layout from '../components/Layout';

const Home = () => (
  <Layout>
    <h2>Home!</h2>
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/logout">Logout</Link>
      </li>
      <li>
        <Link to="/admin">Admin</Link>
      </li>
      <li>
        <Link to="/signup">Sign up!</Link>
      </li>
    </ul>
  </Layout>
);

export default Home;
