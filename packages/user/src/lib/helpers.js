import pick from 'lodash/pick';
import { ObjectID as objectId } from 'mongodb';

export const extractProfileInfo = (user) => ({
  ...pick(user, [
    '_id', 'username', 'email', 'name', 'accountId', 'lastLogin', 'roles', 'labels',
  ]),
});

export const getAccountId = (request) => objectId(request.auth.credentials.accountId);
