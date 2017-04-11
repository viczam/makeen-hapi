import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <Menu>
    <Menu.Item name="home" as={Link} to="/admin">
      Home
    </Menu.Item>
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

export default Navbar;
