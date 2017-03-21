import pkg from '../package.json';
import ItemRepositoryService from './services/ItemRepository';
import ListRepositoryService from './services/ListRepository';
import ItemsRouter from './routers/Items';
import ListsRouter from './routers/Lists';

export async function register(server, options, next) {
  try {
    const { mongoDb, refManager } = server.plugins['makeen-db'];
    const { messageBus } = server.plugins['hapi-octobus'];
    const serviceBus = server.methods.createServiceBus('todo');
    serviceBus.connect(messageBus);

    const ItemRepository = serviceBus.register(
      new ItemRepositoryService({
        mongoDb,
        refManager,
      }),
    );

    const ListRepository = serviceBus.register(
      new ListRepositoryService({
        mongoDb,
        refManager,
      }),
    );

    server.bind({
      ItemRepository, ListRepository,
    });

    server.expose('ItemRepository', ItemRepository);
    server.expose('ListRepository', ListRepository);

    (new ItemsRouter(ItemRepository)).mount(server);
    (new ListsRouter(ListRepository)).mount(server);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-db', 'makeen-core'],
};
