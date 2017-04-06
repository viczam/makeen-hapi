import pkg from '../package.json';

export async function register(server, options, next) {
  try {
    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: [],
};
