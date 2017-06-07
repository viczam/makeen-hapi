import HTTPTransport from '../../src/octobus/HTTPTransport';

const _jest = jest; // eslint-disable-line

_jest.mock('axios', () => ({
  post: (url, data) => Promise.resolve(data),
}));

test('should create HTTPTransport succesfully', () => {
  const httpTransport = new HTTPTransport('http://localhost:3002');

  httpTransport.sendMessage({ message: 'test data' });

  httpTransport.onMessage(data => {
    expect(data.message).toBe('test data');
  });
});
