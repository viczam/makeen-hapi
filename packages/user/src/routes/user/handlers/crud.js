import Boom from 'boom';
import { toBSON } from 'makeen-core/src/libs/mongo-helpers';

export default {
  async deleteOne(request, reply) {
    const { query } = request.payload;
    const { UserEntity } = this;

    try {
      const parsedQuery = toBSON(query);
      const user = await UserEntity.findOne({ query: parsedQuery });

      if (!user) {
        return reply(Boom.notFound('Unable to find user!'));
      }

      if (user._id.toString() === request.auth.credentials.id.toString()) {
        return reply(Boom.badRequest('You can\'t delete your own user!'));
      }

      return reply(UserEntity.deleteOne({ query: parsedQuery }));
    } catch (err) {
      return reply(Boom.wrap(err));
    }
  },
};
