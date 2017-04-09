import React, { PropTypes } from 'react';
import { BASE_URL } from 'constants/api';
import { Image } from 'semantic-ui-react';

const ProfilePicture = ({ userId, cacheBuster, ...restProps }) => (
  <Image
    {...restProps}
    src={`${BASE_URL}users/${userId}/profile-picture${cacheBuster ? `?${cacheBuster}` : ''}`}
  />
);

ProfilePicture.propTypes = {
  userId: PropTypes.string.isRequired,
  cacheBuster: PropTypes.string,
};

export default ProfilePicture;
