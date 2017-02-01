import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const UserEntity = request.eventDispatcher.lookup('entity.User');
  const userId = objectId(request.auth.credentials.id);
  const user = await UserEntity.findById(userId);

  reply(user);
};
