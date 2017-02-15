import { generateCRUDServices } from 'octobus-mongodb';

class EntityManager {
  static getEntityNamespace = (entityName) => `entity.${entityName}`;

  constructor({ dispatcher, db, refManager }) {
    this.dispatcher = dispatcher;
    this.db = db;
    this.refManager = refManager;
  }

  register(entityName, options) {
    const { dispatcher, db, refManager } = this;
    /**
     * TODO: add a Joi schema to make entity schema required
     */
    const { schema, handlers } = {
      handlers: {},
      ...options,
    };

    const entityNamespace = EntityManager.getEntityNamespace(entityName);
    const crudServiceHandlers = generateCRUDServices(dispatcher, entityNamespace, {
      db,
      schema,
      refManager,
    });

    dispatcher.subscribeMap(entityNamespace, crudServiceHandlers);
    dispatcher.subscribeMap(entityNamespace, handlers);

    const entity = dispatcher.lookup(entityNamespace);

    return entity;
  }

  get(entityName) {
    return this.dispatcher.lookup(EntityManager.getEntityNamespace(entityName));
  }
}

export default EntityManager;
