import Joi from 'joi';
import Boom from 'boom';
import { CRUDServiceContainer } from 'octobus-crud';
import { service, withSchema } from 'makeen-core/src/octobus/annotations';
import { Store } from 'octobus-mongodb-store';
import accountSchema from '../schemas/account';

class Account extends CRUDServiceContainer {
  constructor(options) {
    super(
      new Store({
        db: options.mongoDb,
        refManager: options.refManager,
        collectionName: 'Account',
      }),
      accountSchema,
    );
  }

  @service()
  @withSchema(Joi.object().required())
  async confirm(_id) {
    const account = await this.findById(_id);

    if (!account) {
      throw Boom.badRequest('Account not found!');
    }

    if (account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is already confirmed!');
    }

    account.labels.push('isConfirmed');

    return this.replaceOne(account);
  }

  @service()
  @withSchema(Joi.string().email().required())
  async resendActivationEmail(email) {
    const User = this.extract('user.User');
    const Mail = this.extract('mailer.Mail');

    const user = await User.findOne({
      query: { email },
    });

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    const account = await this.findById(user.accountId);

    if (account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is already confirmed!');
    }

    await Mail.sendActivationEmail({
      user, account,
    });

    return {
      user, account,
    };
  }
}

export default Account;
