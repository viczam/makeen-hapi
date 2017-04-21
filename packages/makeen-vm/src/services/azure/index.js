import Joi from 'joi';
import Promise from 'bluebird';
import msRestAzure from 'ms-rest-azure';
import ComputeManagementClient from 'azure-arm-compute';
import StorageManagementClient from 'azure-arm-storage';
import NetworkManagementClient from 'azure-arm-network';
import { ResourceManagementClient } from 'azure-arm-resource';
import { decorators } from 'octobus.js';
import ServiceContainer from 'makeen-core/build/octobus/ServiceContainer';
import { flatten } from 'lodash';

import {
  listInstancesResponse /* stopInstancesResponse, startInstancesResponse, */,
  azureOptionsSchema,
} from '../../schemas/azuerSchema';

const { service, withSchema } = decorators;

export default class AzureClient extends ServiceContainer {
  resourceClient = null;
  resourceClient = null;
  computeClient = null;
  storageClient = null;
  networkClient = null;

  @service()
  async init(azureCredentials) {
    Joi.attempt(azureCredentials, azureOptionsSchema);

    const {
      /* appId, key, */ tenantId,
      subscriptionId,
      user,
      password,
    } = azureCredentials;

    const login = Promise.promisify(
      msRestAzure.loginWithUsernamePassword,
      msRestAzure,
    );

    const credentials = await login(user, password, { domain: tenantId });

    this.resourceClient = new ResourceManagementClient(
      credentials,
      subscriptionId,
    );
    this.computeClient = new ComputeManagementClient(
      credentials,
      subscriptionId,
    );
    this.storageClient = new StorageManagementClient(
      credentials,
      subscriptionId,
    );
    this.networkClient = new NetworkManagementClient(
      credentials,
      subscriptionId,
    );

    return this;
  }

  @service()
  async isConnected() {
    return !!this.resourceClient;
  }

  @service()
  async listInstances() {
    const groups = await new Promise((resolve, reject) => {
      this.resourceClient.resourceGroups.list((err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });

    const getInstancesTask = groups.map(
      async ({ name }) =>
        new Promise((resolve, reject) => {
          this.computeClient.virtualMachines.list(name, (err, result) => {
            if (err) {
              return reject({ [name]: err });
            }

            return resolve({ [name]: result });
          });
        }),
    );

    const instancesByGroup = await Promise.all(getInstancesTask);
    const getInstancesWithStateTasks = instancesByGroup.map(group => {
      const groupName = Object.keys(group)[0];
      const groupInstances = group[groupName];

      return groupInstances.map(
        ({ name }) =>
          new Promise((res, rej) => {
            this.computeClient.virtualMachines.get(
              groupName,
              name,
              { expand: 'instanceView' },
              (err, result) => {
                if (err) {
                  return rej(err);
                }
                return res(result);
              },
            );
          }),
      );
    });

    const instances = await Promise.all(flatten(getInstancesWithStateTasks));

    Joi.attempt(instances, listInstancesResponse);

    return instances;
  }

  @service()
  @withSchema(Joi.array().items(Joi.string()))
  async turnInstancesOff(ids) {
    const stopTasks = ids.map(id => {
      const { resourceGroupName, vmName } = AzureClient.extractGroupAndName(id);

      if (!resourceGroupName || !vmName) {
        throw new Error(`invalid instance id provided: "${id}"`);
      }

      return new Promise((resolve, reject) => {
        this.computeClient.virtualMachines.powerOff(
          resourceGroupName,
          vmName,
          (err, _result) => {
            if (err) {
              return reject(err);
            }
            return resolve(_result);
          },
        );
      });
    });

    const result = await Promise.all(stopTasks);

    return result;
  }

  @service()
  @withSchema(Joi.array().items(Joi.string()))
  async turnInstancesOn(ids) {
    const stopTasks = ids.map(id => {
      const { resourceGroupName, vmName } = AzureClient.extractGroupAndName(id);

      return new Promise((resolve, reject) => {
        this.computeClient.virtualMachines.start(
          resourceGroupName,
          vmName,
          (err, _result) => {
            if (err) {
              return reject(err);
            }
            return resolve(_result);
          },
        );
      });
    });

    const result = await Promise.all(stopTasks);

    return result;
  }

  static extractGroupAndName(vmId) {
    const values = vmId.split('/');
    let resourceGroupName = null;
    let vmName = null;

    values.forEach((value, index) => {
      if (value === 'resourceGroups') {
        resourceGroupName = values[index + 1];
      }

      if (value === 'virtualMachines') {
        vmName = values[index + 1];
      }
    });

    return { resourceGroupName, vmName };
  }
}
