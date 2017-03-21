import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const { UserRepository } = request.server.plugins['makeen-user'];
  const userId = objectId(request.auth.credentials.id);
  const user = await UserRepository.findById(userId);

  reply(user);
};
