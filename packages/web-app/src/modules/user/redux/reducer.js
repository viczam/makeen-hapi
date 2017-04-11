import { combineReducers } from 'redux';
import { createReducer } from 'lib/redux/helpers';
import {
  AUTHENTICATE,
  LOGOUT,
  FETCH_PROFILE,
  UPDATE_PROFILE,
} from './actionTypes';
import { AUTH_TOKEN } from '../../../constants/auth';

const isAuthenticated = (
  state = !!localStorage.getItem(AUTH_TOKEN),
  action,
) => {
  switch (action.type) {
    case AUTHENTICATE:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};

const profile = createReducer(
  {},
  {
    [FETCH_PROFILE[1]]: (state, { payload }) => payload.data,
    [UPDATE_PROFILE[1]]: (state, { payload }) => ({
      ...state,
      ...payload.data,
    }),
  },
);

export default combineReducers({
  isAuthenticated,
  profile,
});
