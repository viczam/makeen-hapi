import { combineSelectorGroups } from 'lib/redux/helpers';
import * as user from 'modules/user/redux/selectors';

export default combineSelectorGroups({
  user,
});
