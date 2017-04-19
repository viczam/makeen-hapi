/* eslint-disable class-methods-use-this */
import Joi from 'joi';
import { Message } from 'octobus.js';
import stream from 'stream';
import Router from './Router';
import { route } from '../libs/decorators';
import { toBSON } from '../libs/mongo-helpers';

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
  async rpc(request) {
    const topic = request.params.topic.replace(/\//g, '.');
    const data = toBSON(request.payload);
    const message = new Message({ topic, data });

    let result = await request.messageBus.send(message);

    if (result instanceof stream.Readable) {
      result = await result.toArray();
    }

    return result;
  }
}

export default OctobusRouter;
