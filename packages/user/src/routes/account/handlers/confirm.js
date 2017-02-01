import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const { AccountEntity } = this;
  const { id } = request.params;

  try {
    const account = await AccountEntity.confirm({
      _id: objectId(id),
    });

    return reply(account);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
}
