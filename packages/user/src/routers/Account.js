import Router from 'makeen-core/src/routers/Router';
import Joi from 'joi';
import { idValidator } from 'makeen-core/src/libs/mongo-helpers';
import { route } from 'makeen-core/src/octobus/decorators';
import { ObjectID as objectId } from 'mongodb';
import { getAccountId } from '../lib/helpers';

class AccountRouter extends Router {
  constructor(config = {}) {
    super({
      namespace: 'Account',
      basePath: '/account',
      ...config,
    });
  }

  @route({
    path: '/{id}/confirm',
    method: 'GET',
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
    return this.Account.confirm({
      _id: objectId(request.params.id),
    });
  }

  @route({
    path: '/users',
    method: 'GET',
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

  @route({
    path: '/resend-activation-email',
    method: 'POST',
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
