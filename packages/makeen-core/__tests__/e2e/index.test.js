import { createServer, stopServer } from '../helpers/createServer';
import * as makeenCorePlugin from '../../src/index';

let hapiServer;

beforeAll(async () => {
  hapiServer = await createServer({
    loadOnly: ['good', '../../makeen-db'],
  });

  return hapiServer.register([makeenCorePlugin]);
});

afterAll(stopServer);

describe('makeen-core main index file tests', () => {
  test('should load plugin succesfully', async () => {
    expect(hapiServer.plugins['makeen-core']).toBeDefined();
  });
});
