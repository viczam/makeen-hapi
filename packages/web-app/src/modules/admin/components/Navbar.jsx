import React, { PropTypes } from 'react';
import { Menu, Dropdown, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import logoImage from 'assets/images/logo.png';
import styled from 'styled-components';
import styles from 'constants/styles';

const MainMenu = styled(Menu.Menu)`
  &.menu {
    flex: 1;
    justify-content: center;
  }
`;

const Navbar = ({ className }) => (
  <Menu className={className}>
    <Menu.Item name="home" as={Link} to="/admin">
      <Image src={logoImage} />
    </Menu.Item>
    <MainMenu>
      <Menu.Item>
        Hey
      </Menu.Item>
    </MainMenu>
    <Menu.Menu position="right">
      <Menu.Item>
        <Dropdown inline>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/admin/user/profile">Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    </Menu.Menu>
  </Menu>
);

Navbar.propTypes = {
  className: PropTypes.string.isRequired,
};

export default styled(Navbar)`
  &.ui {
    background-color: ${styles.backgroundColor};
  }
`;
