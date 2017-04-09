import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as router } from 'react-router-redux';
import user from 'modules/user/redux/reducer';
// import api from '../modules/api/reducer';

export default combineReducers({
  form,
  router,
  user,
  // api,
});
