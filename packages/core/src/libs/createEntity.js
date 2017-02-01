import { generateCRUDServices } from 'octobus-mongodb';

export default ({ dispatcher, db, refManager }) => ({ entityName, schema, handlers = {} }) => {
  const { subscribeMap } = dispatcher;
  const entityNamespace = `entity.${entityName}`;
  const crudServices = generateCRUDServices(dispatcher, entityNamespace, {
    db,
    schema,
    refManager,
  });

  subscribeMap(entityNamespace, crudServices);
  subscribeMap(entityNamespace, handlers);
};
