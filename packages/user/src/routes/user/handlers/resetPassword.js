import Boom from 'boom';

export default async function (request, reply) {
  const { User } = this;
  const { usernameOrEmail } = request.payload;
  try {
    const { user, updateResult } = await User.resetPassword(usernameOrEmail);
    const curatedUser = await User.dump(user);
    reply({
      user: curatedUser,
      updateResult,
    });
  } catch (err) {
    reply(Boom.wrap(err));
  }
}
