import Router from 'makeen-core/src/routers/Router';
import Joi from 'joi';
import { idValidator } from 'makeen-core/src/libs/mongo-helpers';
import { ObjectID as objectId } from 'mongodb';
import { getAccountId } from '../lib/helpers';

class AccountRouter extends Router {
  constructor(config = {}) {
    super({
      namespace: 'Account',
      basePath: '/account',
      ...config,
    });

    this.addRoutes({
      confirm: {
        path: '/{id}/confirm',
        method: 'GET',
        handler: AccountRouter.confirmHandler,
        config: {
          auth: false,
          validate: {
            params: {
              id: idValidator,
            },
          },
          description: 'Confirm account',
        },
      },
      users: {
        path: '/users',
        method: 'GET',
        handler: AccountRouter.findUsers,
        config: {
          description: 'Retrieve all account users',
        },
      },
      resendActivationEmail: {
        path: '/resend-activation-email',
        method: 'POST',
        handler: AccountRouter.resendActivationEmail,
        config: {
          auth: false,
          validate: {
            payload: {
              email: Joi.string().required().email(),
            },
          },
          description: 'Resend activation email',
        },
      },
    });
  }

  static confirmHandler(request) {
    return this.Account.confirm({
      _id: objectId(request.params.id),
    });
  }

  static findUsers(request) {
    return this.User.findMany({
      query: {
        accountId: getAccountId(request),
      },
      fields: ['_id', 'username', 'email', 'name', 'roles'],
    }).then((c) => c.toArray());
  }

  static async resendActivationEmail(request) {
    const { email } = request.payload;

    await this.Account.resendActivationEmail({ email });

    return { ok: true };
  }
}

export default AccountRouter;
