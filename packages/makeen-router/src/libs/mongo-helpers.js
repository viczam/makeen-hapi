import Joi from 'joi';
import { ObjectID as objectId } from 'mongodb';
import EJSON from 'mongodb-extended-json';

export const toBSON = query =>
  EJSON.parse(typeof query !== 'string' ? JSON.stringify(query) : query);

export const idPattern = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export const idValidator = Joi.string().regex(idPattern).required();

export const idToQuery = id => ({ _id: objectId(id) });
