import pkg from '../package.json';

export function register(server, options, next) {
  const { entityManager } = server.plugins['makeen-storage'];
  server.bind({
    entityManager,
  });

  next();
}

register.attributes = {
  pkg,
  dependencies: ['hapi-octobus', 'makeen-storage'],
};
