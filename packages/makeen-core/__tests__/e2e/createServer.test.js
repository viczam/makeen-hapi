import { createServer, stopServer } from '../helpers/createServer';

let hapiServer;

beforeAll(async () => {
  hapiServer = await createServer();

  return hapiServer;
});

afterAll(stopServer);

test('should create HAPI.js server succesfully', async () => {
  expect(hapiServer).toBeDefined();
});
