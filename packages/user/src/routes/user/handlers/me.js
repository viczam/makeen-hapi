import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';
import { extractProfileInfo } from '../../../lib/helpers';

export default async function (request, reply) {
  const { UserEntity } = this;

  try {
    const userId = objectId(request.auth.credentials.id);
    const user = await UserEntity.findById(userId);
    reply({
      ...extractProfileInfo(user),
      profilePicture: request.server.settings.app.uploadDir,
    });
  } catch (err) {
    reply(Boom.wrap(err));
  }
}
