import Promise from 'bluebird';

import { createServer, stopServer } from '../helpers/createServer';
import * as makeenCorePlugin from '../../src/index';

let hapiServer;

const { expect, test, beforeAll, afterAll, describe } = window;

beforeAll(async () => {
  hapiServer = await createServer({
    loadOnly: ['good', '../../makeen-db'],
  });

  return new Promise((resolve, reject) => {
    hapiServer.register([makeenCorePlugin], {}, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
});

afterAll(async () => {
  const result = await stopServer();

  return result;
});

describe('makeen-core main index file tests', () => {
  test('should load plugin succesfully', async () => {
    expect(hapiServer.plugins['makeen-core']).toBeDefined();
  });

  test('should throw on unhandled promise rejection', () => {
    global.console = { log: window.jest.fn() }; // eslint-disable-line
    Promise.reject('test error');

    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          try {
            expect(global.console.log.mock.calls.length).toBe(1);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        500,
      );
    });
  });
});
