import pick from 'lodash/pick';

export const extractProfileInfo = (user) => ({
  ...pick(user, [
    '_id', 'username', 'email', 'name', 'accountId', 'lastLogin', 'roles',
  ]),
});
