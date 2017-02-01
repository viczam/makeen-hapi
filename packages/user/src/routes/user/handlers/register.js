import Boom from 'boom';

export default async function handler(request, reply) {
  const { User } = this;
  const { payload } = request;

  try {
    const result = await User.register(payload);
    return reply(result);
  } catch (err) {
    return reply(Boom.wrap(err));
  }
}
