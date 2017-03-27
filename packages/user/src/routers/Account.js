import Router from 'makeen-router/src/routers/Router';
import Joi from 'joi';
import { idValidator } from 'makeen-router/src/libs/mongo-helpers';
import { route } from 'makeen-router';
import { ObjectID as objectId } from 'mongodb';
import { getAccountId } from '../lib/helpers';

class AccountRouter extends Router {
  constructor({
    User, Account,
  }, config = {}) {
    super({
      namespace: 'Account',
      basePath: '/account',
      ...config,
    });

    this.User = User;
    this.Account = Account;
  }

  @route.get({
    path: '/{id}/confirm',
    config: {
      auth: false,
      validate: {
        params: {
          id: idValidator,
        },
      },
      description: 'Confirm account',
    },
  })
  confirm(request) {
    return this.Account.confirm(objectId(request.params.id));
  }

  @route.get({
    path: '/users',
    config: {
      description: 'Retrieve all account users',
    },
  })
  findUsers(request) {
    return this.User.findMany({
      query: {
        accountId: getAccountId(request),
      },
      fields: ['_id', 'username', 'email', 'name', 'roles'],
    }).then((c) => c.toArray());
  }

  @route.post({
    path: '/resend-activation-email',
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().required().email(),
        },
      },
      description: 'Resend activation email',
    },
  })
  async resendActivationEmail(request) {
    const { email } = request.payload;

    await this.Account.resendActivationEmail({ email });

    return { ok: true };
  }
}

export default AccountRouter;
