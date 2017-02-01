import Boom from 'boom';
import { ObjectID as objectId } from 'mongodb';
import { extractProfileInfo } from '../../../lib/helpers';

export default async function (request, reply) {
  const { UserEntity } = this;
  const userId = objectId(request.auth.credentials.id);
  const data = request.payload;

  try {
    const user = await UserEntity.findById(userId);
    await UserEntity.updateOne({
      query: {
        _id: userId,
      },
      update: {
        $set: data,
      },
    });

    reply(
      extractProfileInfo({
        ...user,
        ...data,
      }),
    );
  } catch (err) {
    reply(Boom.wrap(err));
  }
}
