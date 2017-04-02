import Router from 'makeen-router/src/routers/Router';
import Joi from 'joi';
import { route, mongoHelpers } from 'makeen-router';
import { Message } from 'octobus.js';
import stream from 'stream';

class OctobusRouter extends Router {
  constructor() {
    super({
      namespace: 'Demo',
      basePath: '/',
    });
  }

  @route.post({
    path: '/rpc/{topic*}',
    config: {
      auth: {
        strategy: 'jwt',
        scope: 'admin',
      },
      validate: {
        params: {
          topic: Joi.string().required(),
        },
      },
      description: 'Confirm account',
    },
  })
  async rpc(request) { // eslint-disable-line
    const topic = request.params.topic.replace(/\//g, '.');
    const data = mongoHelpers.toBSON(request.payload);
    const message = new Message({ topic, data });

    let result = await request.messageBus.send(message);

    if (result instanceof stream.Readable) {
      result = await result.toArray();
    }

    return result;
  }
}

export default OctobusRouter;
