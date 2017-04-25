import { CRUDServiceContainer } from 'octobus-crud';
import Joi from 'joi';
import { MongoResourceRouter } from 'makeen-router';
import Confidence from 'confidence';
import Promise from 'bluebird';
import { omit } from 'lodash';

import createServer from '../src/libs/createServer';
import Plugin from '../src/libs/Plugin';
import serverManifest from './serverManifest.test.json';

const { expect, test, beforeAll, describe } = window;

window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;

let hapiServer;
const testItemName = `TestItem${Math.random()}`;

// test entity schema
const testSchema = {
  name: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  _id: Joi.object(),
};

// test ServiceContaier class with CRUD db operations
class TestRepositoryService extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, testSchema);
  }
}

// test Router
class TestRouter extends MongoResourceRouter {
  constructor(TestRepository) {
    super(TestRepository, {
      namespace: 'TestPlugin',
      basePath: '/test/plugin',
      entitySchema: testSchema,
      baseRouteConfig: {
        auth: false,
      },
    });
  }
}

// test Plugin based on service and router
class TestPlugin extends Plugin {
  async boot(/* server */) {
    const TestPluginRepository = new TestRepositoryService({
      store: this.createStore({ collectionName: 'TestRepository' }),
    });

    const testRouter = new TestRouter(TestPluginRepository);

    this.createResource('TestPlugin', {
      repository: TestPluginRepository,
      router: testRouter,
    });
  }
}

beforeAll(async () => {
  const testPlugin = new TestPlugin({});
  const store = new Confidence.Store(serverManifest);
  hapiServer = await createServer(store);

  return new Promise((resolve, reject) => {
    hapiServer.register([testPlugin], {}, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
});

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

describe('should provide a ServiceContainer with CRUD methods', () => {
  test('should CREATE test item', async () => {
    const { TestPluginRepository } = hapiServer.plugins.testPlugin;
    const response = await TestPluginRepository.createOne({
      name: `${testItemName}_service`,
    });

    expect(response).toBeDefined();
    expect(response.name).toBe(`${testItemName}_service`);
  });

  test('should READ test item', async () => {
    const { TestPluginRepository } = hapiServer.plugins.testPlugin;
    const response = await TestPluginRepository.findOne({
      query: {
        name: `${testItemName}_service`,
      },
    });

    expect(response).toBeDefined();
    expect(response.name).toBe(`${testItemName}_service`);
  });

  test('should PARTIALLY UPDATE test item', async () => {
    const { TestPluginRepository } = hapiServer.plugins.testPlugin;
    await TestPluginRepository.updateOne({
      query: {
        name: `${testItemName}_service`,
      },
      update: {
        $set: {
          name: `${testItemName}_service_updated`,
        },
      },
    });

    const response = await TestPluginRepository.findOne({
      query: {
        name: `${testItemName}_service_updated`,
      },
    });

    expect(response).toBeDefined();
  });

  test('should FULLY UPDATE a.k.a. REPLACE test item', async () => {
    const { TestPluginRepository } = hapiServer.plugins.testPlugin;
    const itemToBeReplaced = await TestPluginRepository.findOne({
      query: {
        name: `${testItemName}_service_updated`,
      },
    });

    await TestPluginRepository.replaceOne({
      ...omit(itemToBeReplaced, 'name'),
      name: `${testItemName}_service_updated_replaced`,
    });

    const response = await TestPluginRepository.findOne({
      query: {
        _id: itemToBeReplaced._id,
      },
    });

    expect(response).toBeDefined();
    expect(response.name).toBe(`${testItemName}_service_updated_replaced`);
  });

  test('should DELETE test item', async () => {
    const { TestPluginRepository } = hapiServer.plugins.testPlugin;
    const itemToBeRemoved = await TestPluginRepository.findOne({
      query: {
        name: `${testItemName}_service_updated_replaced`,
      },
    });

    await TestPluginRepository.deleteOne({
      query: itemToBeRemoved,
    });

    const response = await TestPluginRepository.findOne({
      query: {
        _id: itemToBeRemoved._id,
      },
    });

    expect(response).toBeNull();
  });
});
