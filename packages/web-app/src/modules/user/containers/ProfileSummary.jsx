import { connect } from 'react-redux';
import selectors from 'store/selectors';
import ProfileSummary from '../components/ProfileSummary';

export default connect(
  (state) => selectors.user.getProfile(state),
)(ProfileSummary);
