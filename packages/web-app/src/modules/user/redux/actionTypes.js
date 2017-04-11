import * as helpers from 'lib/redux/helpers';

const namespace = 'user';

const createAPIActionTypes = type =>
  helpers.createAPIActionTypes({ namespace, type });

export const LOGIN = createAPIActionTypes('LOGIN');
export const LOGOUT = `${namespace}/LOGOUT`;
export const AUTHENTICATE = `${namespace}/AUTHENTICATE`;
export const SIGN_UP = createAPIActionTypes('SIGN_UP');
export const CONFIRM_ACCOUNT = createAPIActionTypes('CONFIRM_ACCOUNT');
export const RESEND_ACTIVATION_EMAIL = createAPIActionTypes(
  'RESEND_ACTIVATION_EMAIL',
);
export const RESET_PASSWORD = createAPIActionTypes('RESET_PASSWORD');
export const RECOVER_PASSWORD = createAPIActionTypes('RECOVER_PASSWORD');
export const FETCH_PROFILE = createAPIActionTypes('FETCH_PROFILE');
export const UPDATE_PROFILE = createAPIActionTypes('UPDATE_PROFILE');
