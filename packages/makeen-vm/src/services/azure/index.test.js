import AzureClient from './index';
import { loadPluginOptions } from '../../helpers/index';

const { expect, beforeEach } = window;

const azureClient = new AzureClient();
const { azureCredentials } = loadPluginOptions();

window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 350000;

beforeEach(async () => {
  await azureClient.init(azureCredentials);
});

test('should authenticate correctly', async () => {
  const isConnected = await azureClient.isConnected();

  expect(isConnected).toBe(true);
});

test('should list instances correctly', async () => {
  const instances = await azureClient.listInstances();

  expect(instances).toBeDefined();
});

test('should turn instance off', async () => {
  const instances = await azureClient.listInstances();

  const activeMachine = instances.find(({ instanceView: { statuses } }) =>
    statuses.find(({ code }) => code === 'PowerState/running'));
  if (!activeMachine) {
    expect(true).toBe(false);
    return;
  }

  const result = await azureClient.turnInstancesOff([activeMachine.id]);

  expect(result).toBeDefined();
});

test('should turn instance on', async () => {
  const instances = await azureClient.listInstances();

  const activeMachine = instances.find(({ instanceView: { statuses } }) =>
    statuses.find(({ code }) => code === 'PowerState/stopped'));
  if (!activeMachine) {
    expect(true).toBe(false);
    return;
  }

  const result = await azureClient.turnInstancesOn([activeMachine.id]);

  expect(result).toBeDefined();
});
