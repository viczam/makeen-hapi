import { fetchProfile } from 'modules/user/redux/actionCreators';
import { PRELOAD } from './actionTypes';

export const preload = () =>
  async dispatch => {
    dispatch({
      type: PRELOAD[0],
    });

    return Promise.all([dispatch(fetchProfile())]).then(
      () => dispatch({ type: PRELOAD[1] }),
      err => dispatch({ type: PRELOAD[2], err }),
    );
  };
