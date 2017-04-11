import React, { PropTypes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

const Layout = ({ children, className }) => (
  <div className={classNames('ui container', className)}>
    <h1>Makeen</h1>
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

export default styled(Layout)`
  min-height: 100vh;
`;
