import Joi from 'joi';
import { Router, route } from 'makeen-router';
import Boom from 'boom';
import * as awsSchemas from '../schemas/awsSchema';

export default class AwsRoutes extends Router {
  constructor(AwsService, authOption) {
    super({
      namespace: 'MakeenVM.AWS',
      basePath: '/vm/aws',
    });

    this.AwsService = AwsService;

    Object.keys(this.routes).forEach(routeName => {
      const { config } = this.routes[routeName];
      config.auth = authOption;
    });
  }

  @route.get({
    method: 'GET',
    path: '/list',
    config: {
      description: 'AWS endopoint',
      auth: false,
      plugins: {
        'hapi-swagger': {
          responseMessages: awsSchemas.listInstancesResponse,
        },
      },
    },
  })
  async listAwsInstances() {
    try {
      const result = await this.AwsService.listInstances();

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }

  @route.get({
    method: 'GET',
    path: '/stop',
    config: {
      description: 'AWS stop instances endopoint',
      auth: false,
      validate: {
        query: {
          instanceIds: Joi.array()
            .items(Joi.string())
            .min(1)
            .unique()
            .required(),
        },
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: awsSchemas.stopInstancesResponse,
        },
      },
    },
  })
  async stopInstances(request) {
    try {
      const { instanceIds } = request.query;
      const result = await this.AwsService.turnInstancesOff(instanceIds);

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }

  @route.get({
    method: 'GET',
    path: '/start',
    config: {
      description: 'AWS start instances endopoint',
      auth: false,
      validate: {
        query: {
          instanceIds: Joi.array()
            .items(Joi.string())
            .min(1)
            .unique()
            .required(),
        },
      },
      plugins: {
        'hapi-swagger': {
          responseMessages: awsSchemas.startInstancesResponse,
        },
      },
    },
  })
  async startInstances(request) {
    try {
      const { instanceIds } = request.query;
      const result = await this.AwsService.turnInstancesOn(instanceIds);

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }
}
