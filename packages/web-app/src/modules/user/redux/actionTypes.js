import { createAPIActionTypes } from 'lib/redux/helpers';

const namespace = 'user';

export const LOGIN = createAPIActionTypes({ namespace, type: 'LOGIN' });
export const LOGOUT = `${namespace}/LOGOUT`;
export const AUTHENTICATE = `${namespace}/AUTHENTICATE`;
export const SIGN_UP = createAPIActionTypes({ namespace, type: 'SIGN_UP' });
export const CONFIRM_ACCOUNT = createAPIActionTypes({
  namespace,
  type: 'CONFIRM_ACCOUNT',
});
export const RESEND_ACTIVATION_EMAIL = createAPIActionTypes({
  namespace,
  type: 'RESEND_ACTIVATION_EMAIL',
});
export const RESET_PASSWORD = createAPIActionTypes({
  namespace,
  type: 'RESET_PASSWORD',
});
export const RECOVER_PASSWORD = createAPIActionTypes({
  namespace,
  type: 'RECOVER_PASSWORD',
});
export const FETCH_PROFILE = createAPIActionTypes({
  namespace,
  type: 'FETCH_PROFILE',
});
export const UPDATE_PROFILE = createAPIActionTypes({
  namespace,
  type: 'UPDATE_PROFILE',
});
export const UPLOAD_PROFILE_PICTURE = createAPIActionTypes({
  namespace,
  type: 'UPLOAD_PROFILE_PICTURE',
});
