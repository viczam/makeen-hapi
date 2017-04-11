import React, { PropTypes } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import AccountPreload from 'modules/account/containers/Preload';
import Sidebar from './Sidebar';
import Main from './Main';
import Navbar from './Navbar';

const ContentWrapper = styled.div`
  display: flex;
`;

const Admin = ({ children, className }) => (
  <div className={classNames('ui container', className)}>
    <Navbar />

    <ContentWrapper>
      <Sidebar>
        this is sidebar
      </Sidebar>
      <Main>
        <AccountPreload>
          {children}
        </AccountPreload>
      </Main>
    </ContentWrapper>
  </div>
);

Admin.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Admin.defaultProps = {
  className: null,
};

export default styled(Admin)`
`;
