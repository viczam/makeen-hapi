import Boom from 'boom';

export default function validateSlackToken(request, reply) {
  const { token } = this;

  if (request.payload.token !== token) {
    return reply(Boom.badData('Invalid Token'));
  }

  return reply();
}
