import { AUTH_TOKEN } from 'constants/auth';
import {
  LOGIN,
  AUTHENTICATE,
  LOGOUT,
  SIGN_UP,
  CONFIRM_ACCOUNT,
  RESEND_ACTIVATION_EMAIL,
  RESET_PASSWORD,
  RECOVER_PASSWORD,
  FETCH_PROFILE,
  UPDATE_PROFILE,
} from './actionTypes';

export const authenticate = token =>
  dispatch => {
    localStorage.setItem(AUTH_TOKEN, token);
    dispatch({ type: AUTHENTICATE });
  };

export const login = (username, password) =>
  async dispatch => {
    const response = await dispatch({
      types: LOGIN,
      payload: {
        request: {
          url: '/users/login',
          method: 'post',
          data: {
            username,
            password,
          },
        },
      },
    });

    const { token } = response.payload.data;
    dispatch(authenticate(token));

    return response;
  };

export const logout = () =>
  dispatch => {
    localStorage.removeItem(AUTH_TOKEN);
    dispatch({ type: LOGOUT });
  };

export const signUp = data => ({
  types: SIGN_UP,
  payload: {
    request: {
      url: '/users/signup',
      method: 'post',
      data,
    },
  },
});

export const confirmAccount = accountId => ({
  types: CONFIRM_ACCOUNT,
  payload: {
    request: {
      url: `/account/${accountId}/confirm`,
      method: 'get',
    },
  },
});

export const resendActivationEmail = email => ({
  types: RESEND_ACTIVATION_EMAIL,
  payload: {
    request: {
      url: '/account/resend-activation-email',
      method: 'post',
      data: {
        email,
      },
    },
  },
});

export const resetPassword = usernameOrEmail => ({
  types: RESET_PASSWORD,
  payload: {
    request: {
      url: '/users/reset-password',
      method: 'post',
      data: {
        usernameOrEmail,
      },
    },
  },
});

export const recoverPassword = ({ password, token }) => ({
  types: RECOVER_PASSWORD,
  payload: {
    request: {
      url: `/users/recover-password/${token}`,
      method: 'post',
      data: {
        password,
      },
    },
  },
});

export const fetchProfile = () => ({
  types: FETCH_PROFILE,
  payload: {
    request: {
      url: '/users/me',
      method: 'get',
    },
  },
});

export const updateProfile = data => ({
  types: UPDATE_PROFILE,
  payload: {
    request: {
      url: '/users/me',
      method: 'post',
      data,
    },
    data,
  },
});
