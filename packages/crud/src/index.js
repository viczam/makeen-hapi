import pkg from '../package.json';

export function register(server, options, next) {
  next();
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus'],
};
