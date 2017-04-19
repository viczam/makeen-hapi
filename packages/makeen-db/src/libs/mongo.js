import { MongoClient } from 'mongodb';

const connect = ({ host, port, db }) =>
  MongoClient.connect(`mongodb://${host}:${port}/${db}`);

export { connect };
