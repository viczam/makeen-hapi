import Confidence from 'confidence';
import createServer from '../src/libs/createServer';

const { expect, test, beforeAll } = window;

let store;

beforeAll(() => {
  store = new Confidence.Store({});
});

test('should create HAPI.js server succesfully', async () => {
  const result = await createServer(store);

  expect(result).toBeDefined();
});
