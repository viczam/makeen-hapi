import setupUserServices from './user/index';
import setupAccountServices from './account/index';
import setupUserLoginServices from './userLogin/index';

export default (options) => {
  setupUserServices(options);
  setupAccountServices(options);
  setupUserLoginServices(options);
};
