import _ from 'lodash';

export default ({ params }) => (
  _.pick(params, [
    'accountId', 'username', 'firstName', 'lastName', 'email', '_id', 'updatedAt',
    'createdAt', 'token', 'status', 'lastLogin', 'roles',
  ])
);
