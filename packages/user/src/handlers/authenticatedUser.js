import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const UserRepository = request.serviceBus.extractRepository('user.User');
  const userId = objectId(request.auth.credentials.id);
  const user = await UserRepository.findById(userId);

  reply(user);
};
