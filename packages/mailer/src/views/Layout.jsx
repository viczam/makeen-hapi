import React, { PropTypes } from 'react';

const Layout = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
    </head>
    <body>
      {children}
    </body>
  </html>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
