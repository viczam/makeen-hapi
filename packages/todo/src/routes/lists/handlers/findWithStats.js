import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const { TodoListEntity } = this;
  const accountId = objectId(request.auth.credentials.accountId);

  try {
    const result = await TodoListEntity.findManyWithStats({
      query: { accountId },
    });

    reply(result);
  } catch (err) {
    reply(Boom.wrap(err));
  }
};
