import Boom from 'boom';
import { decorators } from 'octobus.js';
import moment from 'moment';

const { withLookups } = decorators;

const handler = async ({ params, User, UserEntity }) => {
  const { provider, token, expiresIn, profile } = params;

  if (provider === 'google') {
    profile.id = profile.raw.sub;
  }

  const user = await UserEntity.findOne({
    query: {
      $or: [{
        [`socialLogin.${provider}.id`]: profile.id,
      }, {
        email: profile.email,
      }],
    },
  });

  if (!user) {
    throw Boom.badRequest('User not found!');
  }

  user.socialLogin[provider] = {
    id: profile.id,
    name: profile.displayName,
    email: profile.email,
    token,
    expiresAt: moment().add(expiresIn, 'seconds').toDate(),
  };

  const updatedUser = await UserEntity.replaceOne({
    ...user,
    lastLogin: new Date(),
  });

  const authToken = await User.createToken({ id: updatedUser._id, username: updatedUser.username });

  return {
    ...updatedUser,
    token: authToken,
  };
};

export default withLookups({
  User: 'User',
  UserEntity: 'entity.User',
})(handler);
