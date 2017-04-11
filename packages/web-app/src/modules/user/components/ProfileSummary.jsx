import React, { PropTypes } from 'react';
import { Divider } from 'semantic-ui-react';

const ProfileSummary = ({ name }) => (
  <div>
    <Divider section horizontal>{name}</Divider>
  </div>
);

ProfileSummary.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ProfileSummary;
