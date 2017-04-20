import Aws from 'aws-sdk';
import Joi from 'joi';
import Promise from 'bluebird';

import {
  listInstancesResponse,
  stopInstancesResponse,
  startInstancesResponse,
  awsOptionsSchema,
} from '../../schemas/awsSchema';

export default class EC2Client {
  ec2 = null;

  constructor(awsCredentials) {
    Joi.attempt(awsCredentials, awsOptionsSchema);

    this.ec2 = new Aws.EC2(awsCredentials);
  }

  async isConnected() {
    return !!this.ec2.config.credentials;
  }

  async listInstances() {
    const listInstances = Promise.promisify(this.ec2.describeInstances, {
      context: this.ec2,
    });
    const response = await listInstances({ DryRun: false });

    Joi.attempt(response, listInstancesResponse);

    const { Reservations: [Instances] } = response;
    return Instances;
  }

  async turnInstancesOff(instanceIds) {
    const stopInstances = Promise.promisify(this.ec2.stopInstances, {
      context: this.ec2,
    });
    const result = await stopInstances({ InstanceIds: instanceIds });

    Joi.attempt(result, stopInstancesResponse);

    return result;
  }

  async turnInstancesOn(instanceIds) {
    const startInstances = Promise.promisify(this.ec2.startInstances, {
      context: this.ec2,
    });
    const result = await startInstances({ InstanceIds: instanceIds });

    Joi.attempt(result, startInstancesResponse);

    return result;
  }
}
