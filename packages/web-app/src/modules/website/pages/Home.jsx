import React from 'react';
import Link from 'react-router-dom/Link';

const Home = () => (
  <div>
    <h2>Home!</h2>
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/logout">Logout</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </ul>
  </div>
);

export default Home;
