import React, { PropTypes } from 'react';

const NoMatch = ({ location }) => (
  <div>
    <h2>Whoops!</h2>
    <p>Sorry but {location.pathname} didn’t match any pages!</p>
  </div>
);

NoMatch.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NoMatch;
