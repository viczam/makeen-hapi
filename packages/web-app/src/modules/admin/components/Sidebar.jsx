import React from 'react';
import styled from 'styled-components';
import { Menu, Input } from 'semantic-ui-react';

const Wrapper = styled.div`
  margin-top: 10px;
  min-height: 100%;
  width: 220px;
`;

const Sidebar = () => (
  <Wrapper>
    <Menu vertical>
      <Menu.Item>
        <Input placeholder="Search..." />
      </Menu.Item>
    </Menu>
  </Wrapper>
);

Sidebar.propTypes = {
};

Sidebar.defaultProps = {
  workspaces: [],
};

export default Sidebar;
