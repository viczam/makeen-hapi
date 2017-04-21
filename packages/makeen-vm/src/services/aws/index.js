import Aws from 'aws-sdk';
import Joi from 'joi';
import Promise from 'bluebird';
import { decorators } from 'octobus.js';
import ServiceContainer from 'makeen-core/build/octobus/ServiceContainer';

import {
  listInstancesResponse,
  stopInstancesResponse,
  startInstancesResponse,
  awsOptionsSchema,
} from '../../schemas/awsSchema';

const { service, withSchema } = decorators;

export default class EC2Client extends ServiceContainer {
  ec2 = null;

  setServiceBus(...args) {
    super.setServiceBus(...args);
  }

  constructor(awsCredentials) {
    super();

    Joi.attempt(awsCredentials, awsOptionsSchema);

    this.ec2 = new Aws.EC2(awsCredentials);
  }
  @service()
  async isConnected() {
    return !!this.ec2.config.credentials;
  }

  @service()
  async listInstances() {
    const listInstances = Promise.promisify(this.ec2.describeInstances, {
      context: this.ec2,
    });
    const response = await listInstances({ DryRun: false });

    Joi.attempt(response, listInstancesResponse);

    const { Reservations: [Instances] } = response;
    return Instances;
  }

  @service()
  @withSchema(Joi.array().items(Joi.string()))
  async turnInstancesOff(instanceIds) {
    const stopInstances = Promise.promisify(this.ec2.stopInstances, {
      context: this.ec2,
    });
    const result = await stopInstances({ InstanceIds: instanceIds });

    Joi.attempt(result, stopInstancesResponse);

    return result;
  }

  @service()
  @withSchema(Joi.array().items(Joi.string()))
  async turnInstancesOn(instanceIds) {
    const startInstances = Promise.promisify(this.ec2.startInstances, {
      context: this.ec2,
    });
    const result = await startInstances({ InstanceIds: instanceIds });

    Joi.attempt(result, startInstancesResponse);

    return result;
  }
}
