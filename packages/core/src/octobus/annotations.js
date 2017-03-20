import Joi from 'joi';
import { annotations } from 'octobus.js';

const { service } = annotations;

const withSchema = (schema) => (target, propr, descriptor) => {
  const oldValue = descriptor.value;

  Object.assign(descriptor, {
    value(...args) {
      return oldValue.apply(this, [Joi.attempt(args[0], schema), ...args.slice(1)]);
    },
  });
};

const route = (definition) => (target, propr, descriptor) => {
  Object.assign(descriptor, {
    enumerable: true,
  });

  Object.assign(descriptor.value, {
    isRoute: true,
    definition,
  });

  return descriptor;
};

export {
  service,
  withSchema,
  route,
};
