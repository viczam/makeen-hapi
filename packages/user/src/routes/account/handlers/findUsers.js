import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const { UserEntity } = this;
  const accountId = objectId(request.auth.credentials.accountId);

  try {
    const users = await UserEntity.findMany({
      query: {
        accountId,
      },
      fields: ['_id', 'username', 'email', 'name', 'roles'],
    }).then((c) => c.toArray());

    return reply(users);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
}
