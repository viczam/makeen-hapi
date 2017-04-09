import React, { PropTypes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

const External = ({ children, className }) => (
  <div className={classNames('ui container', className)}>
    <h1>Makeen</h1>
    {children}
  </div>
);

External.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

export default styled(External)`
  min-height: 100vh;
`;
