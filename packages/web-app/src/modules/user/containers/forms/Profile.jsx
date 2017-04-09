import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import pick from 'lodash/pick';
import * as actions from '../../redux/actionCreators';
import ProfileForm from '../../forms/Profile';

class ProfileFormContainer extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    profileData: PropTypes.object,
  };

  handleSubmit = (data) => (
    this.props.updateProfile(data).catch(({ error }) => {
      throw new SubmissionError({ _error: error.response.data.message });
    })
  )

  render() {
    const initialValues = this.props.profileData;
    return (
      <ProfileForm
        onSubmit={this.handleSubmit}
        initialValues={{
          ...initialValues,
          birthdate: initialValues.birthdate ? new Date(initialValues.birthdate) : null,
        }}
      />
    );
  }
}

export default connect(
  ({ user }) => ({
    profileData: pick(user.profile, ['name', 'username', 'email', 'title', 'bio', 'timezone', 'birthdate']),
  }),
  actions,
)(ProfileFormContainer);
