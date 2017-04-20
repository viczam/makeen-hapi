import Joi from 'joi';
import { Router, route } from 'makeen-router';
import Boom from 'boom';
import AzureClient from '../services/azure';
import * as azureSchemas from '../schemas/azuerSchema';

export default class AzureRoutes extends Router {
  es2Client = null;

  constructor(azureCredentials, authOption) {
    super({
      namespace: 'MakeenVM.Azure',
      basePath: '/vm/azure',
    });

    this.azureClient = new AzureClient();
    this.azureClient.init(azureCredentials);

    Object.keys(this.routes).forEach(routeName => {
      const { config } = this.routes[routeName];
      config.auth = authOption;
    });
  }

  @route.get({
    method: 'GET',
    path: '/list',
    config: {
      description: 'Azure list endopoint',
      auth: false,
      plugins: {
        'hapi-swagger': {
          responseMessages: azureSchemas.listInstancesResponse,
        },
      },
    },
  })
  async listAzureInstances() {
    try {
      const result = await this.azureClient.listInstances();

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }

  @route.get({
    method: 'GET',
    path: '/stop',
    config: {
      description: 'Azure stop instances endopoint',
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
          responseMessages: [],
        },
      },
    },
  })
  async stopAzureInstances(request) {
    try {
      const { instanceIds } = request.query;
      const result = await this.azureClient.turnInstancesOff(instanceIds);

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }

  @route.get({
    method: 'GET',
    path: '/start',
    config: {
      description: 'Azure start instances endopoint',
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
          responseMessages: [],
        },
      },
    },
  })
  async startAzureInstances(request) {
    try {
      const { instanceIds } = request.query;
      const result = await this.azureClient.turnInstancesOn(instanceIds);

      return result;
    } catch (e) {
      return Boom.badRequest(e.message);
    }
  }
}
