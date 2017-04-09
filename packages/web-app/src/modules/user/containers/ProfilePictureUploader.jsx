import React, { Component, PropTypes } from 'react';
import Uploader from 'components/form/ImageUploader';
import { connect } from 'react-redux';
import * as actions from '../redux/actionCreators';
import ProfilePicture from '../components/ProfilePicture';

class ProfilePictureUploader extends Component {
  static propTypes = {
    uploadProfilePicture: PropTypes.func.isRequired,
    profile: PropTypes.object,
  }

  state = {
    cacheBuster: 0,
  };

  handleChange = (file) => {
    this.props.uploadProfilePicture(file)
      .then(() => {
        this.setState({
          cacheBuster: this.state.cacheBuster + 1,
        });
      });
  }

  render() {
    return (
      <div>
        <ProfilePicture
          size="small"
          shape="circular"
          style={{ height: 150 }}
          userId={this.props.profile._id}
          cacheBuster={this.state.cacheBuster.toString()}
        />
        <Uploader
          multiple={false}
          placeholder="Select profile picture"
          renderPreview={() => null}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default connect(
  ({ user }) => ({ profile: user.profile }),
  actions,
)(ProfilePictureUploader);
