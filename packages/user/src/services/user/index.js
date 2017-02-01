import omit from 'lodash/omit';
import * as handlers from './handlers';

const entityNamespace = 'entity.User';

export default ({
  dispatcher, app,
}) => {
  const { subscribeMap, subscribe } = dispatcher;
  subscribeMap(entityNamespace, omit(handlers, [
    'serialize', 'register', 'login', 'resetPassword', 'recoverPassword', 'socialLogin',
    'dump', 'changePassword',
  ]));
  subscribe('User.serialize', handlers.serialize);
  subscribe('User.register', handlers.register);
  subscribe('User.login', handlers.login);
  subscribe('User.resetPassword', handlers.resetPassword);
  subscribe('User.recoverPassword', handlers.recoverPassword);
  subscribe('User.socialLogin', handlers.socialLogin);
  subscribe('User.dump', handlers.dump);
  subscribe('User.changePassword', handlers.changePassword);
  subscribe('User.getProfilePicture', handlers.getProfilePicture(app.uploadDir));
};
