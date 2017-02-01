import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';

export default async function (request, reply) {
  const { User } = this;
  const { oldPassword, password } = request.payload;
  try {
    reply(await User.changePassword({
      password,
      oldPassword,
      userId: objectId(request.auth.credentials.id),
    }));
  } catch (err) {
    reply(Boom.wrap(err));
  }
}
