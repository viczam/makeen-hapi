import React from 'react';
import ProfileForm from '../containers/forms/Profile';
import ProfilePictureUploader from '../containers/ProfilePictureUploader';

const Profile = () => (
  <div>
    <h1>Profile</h1>

    <ProfilePictureUploader />
    <ProfileForm />
  </div>
);

export default Profile;
