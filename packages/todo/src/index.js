import pkg from '../package.json';
import ItemRepositoryService from './services/ItemRepository';
import ListRepositoryService from './services/ListRepository';
import ItemsRouter from './routers/Items';
import ListsRouter from './routers/Lists';

export async function register(server, options, next) {
  try {
    const serviceBus = server.methods.createServiceBus('todo');

    const ItemRepository = serviceBus.register(
      new ItemRepositoryService({
        store: server.methods.createStore({ collectionName: 'TodoItem' }),
      }),
    );

    const ListRepository = serviceBus.register(
      new ListRepositoryService({
        store: server.methods.createStore({ collectionName: 'TodoList' }),
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
  dependencies: ['makeen-core'],
};
