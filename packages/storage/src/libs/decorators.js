import { decorators } from 'octobus.js';
import EntityManager from './EntityManager';

const { withLookups } = decorators;

export const withEntities = entitiesMap => handler => args => {
  const lookups = Object.keys(entitiesMap).reduce((acc, alias) => ({
    ...acc,
    [alias]: EntityManager.getEntityNamespace(entitiesMap[alias]),
  }), {});

  return withLookups(lookups)(handler)(args);
};
