import Boom from 'boom';

export default async function (request, reply) {
  const { User } = this;
  const { password } = request.payload;
  const { token } = request.params;
  try {
    const { user, updateResult } = await User.recoverPassword({ password, token });
    const curatedUser = await User.dump(user);
    reply({
      user: curatedUser,
      updateResult,
    });
  } catch (err) {
    reply(Boom.wrap(err));
  }
}
