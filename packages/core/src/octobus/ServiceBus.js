import { ServiceBus, Handler } from 'octobus.js';

export default class extends ServiceBus {
  deepSubscribe(topic, subscriber) {
    if (
      typeof subscriber === 'function' ||
      subscriber instanceof Handler
    ) {
      return this.subscribe(topic, subscriber);
    }

    if (Array.isArray(subscriber)) {
      return subscriber.map((s) => this.deepSubscribe(topic, s));
    }

    if (typeof subscriber === 'object') {
      return Object.keys(subscriber).reduce((acc, method) => ({
        ...acc,
        [method]: this.deepSubscribe(`${topic}.${method}`, subscriber[method]),
      }), {});
    }

    throw new Error(`Unable to handle ${subscriber}!`);
  }

  extractRepository(path) {
    return this.extract(`repository.${path}`);
  }
}
