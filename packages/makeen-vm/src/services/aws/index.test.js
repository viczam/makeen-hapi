import EC2Client from './index';
import { loadPluginOptions } from '../../helpers/index';

window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 350000;

const { awsCredentials } = loadPluginOptions();

const { expect } = window;

const ec2Client = new EC2Client(awsCredentials);

test('should authenticate correctly', async () => {
  const isConnected = await ec2Client.isConnected();

  expect(isConnected).toBe(true);
});

test('should list instances correctly', async () => {
  const instances = await ec2Client.listInstances();

  expect(instances).toBeDefined();
});

test('should turn instance off', async () => {
  const {
    Instances: [{ InstanceId, State }],
  } = await ec2Client.listInstances();

  if (State.Name !== 'running') {
    return;
  }
  const result = await ec2Client.turnInstancesOff([InstanceId]);

  expect(result).toBeDefined();
});

test('should turn instance on', async () => {
  const {
    Instances: [{ InstanceId, State }],
  } = await ec2Client.listInstances();

  if (State.Name !== 'stopped') {
    return;
  }

  const result = await ec2Client.turnInstancesOn([InstanceId]);

  expect(result).toBeDefined();
});
