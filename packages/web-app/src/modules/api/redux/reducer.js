import pick from 'lodash/pick';
import { combineReducers } from 'redux';
import { createAPIReducers } from 'lib/redux/crud';
import * as user from 'modules/user/redux/actionTypes';

export default combineReducers({
  user: combineReducers(
    createAPIReducers(
      pick(user, [
        'LOGIN',
        'CONFIRM_ACCOUNT',
        'RESEND_ACTIVATION_EMAIL',
        'RESET_PASSWORD',
        'RECOVER_PASSWORD',
        'REGISTER',
        'FETCH_PROFILE',
      ]),
    ),
  ),
});
