export default async function (request, reply) {
  const { User, UserLogin } = this;

  try {
    const result = await User.login(request.payload);
    const user = await User.dump(result);

    await UserLogin.createOne({
      userId: user._id,
      ip: request.info.remoteAddress,
      browser: request.plugins.scooter.toString(),
    });

    reply(user);
  } catch (err) {
    reply(err);
  }
}
