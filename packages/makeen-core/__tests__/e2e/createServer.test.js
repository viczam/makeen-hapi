import { createServer, stopServer } from '../helpers/createServer';

const { expect, test, beforeAll, afterAll } = window;

let hapiServer;

beforeAll(async () => {
  hapiServer = await createServer();

  return hapiServer;
});

afterAll(async () => {
  const result = await stopServer();

  return result;
});

test('should create HAPI.js server succesfully', async () => {
  expect(hapiServer).toBeDefined();
});
