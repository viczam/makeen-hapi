import Joi from 'joi';
import generateCRUDRoutes from 'makeen-crud/src/libs/generateCRUDRoutes';
import pick from 'lodash/pick';
import authRoutes from 'hb-user/dist/routes/auth';
import * as handlers from './handlers';
import crudHandlers from './handlers/crud';
import userSchema from '../../schemas/user';

const loginRoute = authRoutes[0];
const prefix = '/users';
const generatedCRUDRoutes = generateCRUDRoutes({
  entityName: 'User',
  schema: userSchema,
  pathPrefix: prefix,
});

const userRoutes = [
  'count', 'deleteOne', 'findById', 'findMany', 'findOne', 'replaceOne', 'updateOne',
].reduce((acc, route) => ({
  ...acc,
  [route]: {
    ...generatedCRUDRoutes[route],
    config: {
      ...generatedCRUDRoutes[route].config,
      auth: {
        strategy: 'jwt',
        scope: 'admin',
      },
    },
    handler: crudHandlers[route] || generatedCRUDRoutes[route].handler,
  },
}), {});

export default [{
  ...loginRoute,
  path: `${prefix}/login`,
  handler: handlers.login,
  config: {
    ...loginRoute.config,
    auth: false,
  },
}, {
  path: `${prefix}/register`,
  method: 'POST',
  handler: handlers.register,
  config: {
    auth: false,
    validate: {
      payload: {
        ...pick(userSchema, [
          'name', 'username', 'email', 'password',
        ]),
      },
    },
    description: 'Register a new user',
    tags: ['api'],
  },
}, {
  path: `${prefix}/reset-password`,
  method: 'POST',
  handler: handlers.resetPassword,
  config: {
    auth: false,
    validate: {
      payload: {
        usernameOrEmail: Joi.string(),
      },
    },
    description: 'Reset password',
    tags: ['api'],
  },
}, {
  path: `${prefix}/recover-password/{token}`,
  method: 'POST',
  handler: handlers.recoverPassword,
  config: {
    auth: false,
    validate: {
      params: {
        token: Joi.string().required(),
      },
      payload: {
        password: Joi.string().required(),
      },
    },
    description: 'Recover password',
    tags: ['api'],
  },
}, {
  path: `${prefix}/change-password`,
  method: 'POST',
  handler: handlers.changePassword,
  config: {
    validate: {
      payload: {
        oldPassword: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
    description: 'Change password',
    tags: ['api'],
  },
}, {
  path: `${prefix}/me`,
  method: 'GET',
  handler: handlers.me,
  config: {
    description: 'User profile',
    tags: ['api'],
  },
}, {
  path: `${prefix}/me`,
  method: 'POST',
  handler: handlers.updateProfile,
  config: {
    description: 'Update user profile',
    tags: ['api'],
    validate: {
      payload: pick(userSchema, ['username', 'name', 'email']),
    },
  },
}].concat(
  Object.keys(userRoutes).map((routeName) => userRoutes[routeName]),
);
