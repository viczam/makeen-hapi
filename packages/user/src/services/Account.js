import Joi from 'joi';
import Boom from 'boom';
import { decorators } from 'octobus.js';
import ServiceContainer from 'makeen-core/src/octobus/ServiceContainer';

const { service, withSchema } = decorators;

class Account extends ServiceContainer {
  setServiceBus(...args) {
    super.setServiceBus(...args);
    this.AccountRepository = this.extract('Account');
  }

  @service()
  @withSchema(Joi.object().required())
  async confirm(_id) {
    const account = await this.AccountRepository.findById(_id);

    if (!account) {
      throw Boom.badRequest('Account not found!');
    }

    if (account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is already confirmed!');
    }

    account.labels.push('isConfirmed');

    return this.AccountRepository.replaceOne(account);
  }

  @service()
  @withSchema(Joi.string().email().required())
  async resendActivationEmail(email) {
    const UserRepository = this.extract('user.UserRepository');
    const Mail = this.extract('mailer.Mail');

    const user = await UserRepository.findOne({
      query: { email },
    });

    if (!user) {
      throw Boom.badRequest('User not found!');
    }

    const account = await this.AccountRepository.findById(user.accountId);

    if (account.labels.includes('isConfirmed')) {
      throw Boom.badRequest('Account is already confirmed!');
    }

    await Mail.sendActivationEmail({
      user,
      account,
    });

    return {
      user,
      account,
    };
  }
}

export default Account;
