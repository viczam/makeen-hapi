import { CRUDServiceContainer } from 'octobus-crud';
import Joi from 'joi';
import { MongoResourceRouter } from 'makeen-router';
import { createServer, stopServer } from '../helpers/createServer';
import Plugin from '../../src/libs/Plugin';

let hapiServer;
const testItemName = `TestItem${Math.random()}`;

// test entity schema
const testSchema = {
  name: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  _id: Joi.object(),
};

// test Plugin based on service and router
class TestPlugin extends Plugin {
  async boot(/* server */) {
    // test ServiceContaier class with CRUD db operations
    const TestPluginRepository = new CRUDServiceContainer(
      this.createStore({ collectionName: 'TestRepository' }),
      testSchema,
    );

    // test router
    const testRouter = new MongoResourceRouter(TestPluginRepository, {
      namespace: 'TestPlugin',
      basePath: '/test/plugin',
      entitySchema: testSchema,
      baseRouteConfig: {
        auth: false,
      },
    });

    this.createResource('TestPlugin', {
      repository: TestPluginRepository,
      router: testRouter,
    });
  }
}

beforeAll(async () => {
  const testPlugin = new TestPlugin();
  hapiServer = await createServer();

  return hapiServer.register([testPlugin]);
});

afterAll(stopServer);

describe('should create Plugin succesfully', () => {
  test('should create Plugin succesfully', () => {
    expect(hapiServer.plugins.testPlugin).toBeDefined();
  });
});

describe('plugin exposes CRUD REST endpoints', () => {
  test('should CREATE Test item', async () => {
    const response = await hapiServer.inject({
      method: 'POST',
      url: '/test/plugin',
      payload: {
        name: testItemName,
      },
    });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.result.name).toBe(testItemName);
  });

  test('should READ Test item', async () => {
    const response = await hapiServer.inject({
      method: 'GET',
      url: `/test/plugin/findOne?query=${JSON.stringify({
        name: testItemName,
      })}`,
    });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.result.name).toBe(testItemName);
  });

  test('should UPDATE Test item', async () => {
    const updatedName = `${testItemName}_updated`;
    const itemToUpdate = await hapiServer.inject({
      method: 'GET',
      url: `/test/plugin/findOne?query=${JSON.stringify({
        name: testItemName,
      })}`,
    });

    const response = await hapiServer.inject({
      method: 'PUT',
      url: `/test/plugin/${itemToUpdate.result._id}`,
      payload: {
        name: updatedName,
      },
    });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.result.name).toBe(updatedName);
  });

  test('should DELETE Test item', async () => {
    const updatedName = `${testItemName}_updated`;
    const itemToDelete = await hapiServer.inject({
      method: 'GET',
      url: `/test/plugin/findOne?query=${JSON.stringify({
        name: updatedName,
      })}`,
    });

    const response = await hapiServer.inject({
      method: 'DELETE',
      url: `/test/plugin/${itemToDelete.result._id}`,
    });

    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    expect(response.result.name).toBe(`${testItemName}_updated`);
  });
});
