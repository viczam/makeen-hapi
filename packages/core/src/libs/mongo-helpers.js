import EJSON from 'mongodb-extended-json';

export const toBSON = (query) => (
  EJSON.parse(typeof query !== 'string' ? JSON.stringify(query) : query)
);
