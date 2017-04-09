import React from 'react';
import ExternalLayout from 'layouts/External';

const withLayout = (WrappedComponent) => (props = {}) => (
  <ExternalLayout>
    <WrappedComponent {...props} />
  </ExternalLayout>
);

export default withLayout;
