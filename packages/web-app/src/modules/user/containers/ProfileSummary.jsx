import { connect } from 'react-redux';
import ProfileSummary from '../components/ProfileSummary';

export default connect(
  ({ user }) => ({ name: user.profile.name }),
)(ProfileSummary);
