import { decorators } from 'octobus.js';

const { service, withSchema } = decorators;

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
