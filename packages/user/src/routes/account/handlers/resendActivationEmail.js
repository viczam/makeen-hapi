import Boom from 'boom';

export default async function (request, reply) {
  const { AccountEntity } = this;
  const { email } = request.payload;

  try {
    await AccountEntity.resendActivationEmail({ email });
    return reply({
      ok: true,
    });
  } catch (err) {
    return reply(Boom.wrap(err));
  }
}
