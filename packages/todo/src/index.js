import pkg from '../package.json';
import ItemService from './services/Item';
import ListService from './services/List';
import ItemsRouter from './routers/Items';
import ListsRouter from './routers/Lists';

export async function register(server, options, next) {
  try {
    const { mongoDb, refManager } = server.plugins['makeen-db'];
    const { messageBus } = server.plugins['hapi-octobus'];
    const serviceBus = server.methods.createServiceBus('todo');
    serviceBus.connect(messageBus);

    const Item = serviceBus.register(
      new ItemService({
        mongoDb,
        refManager,
      }),
    );

    const List = serviceBus.register(
      new ListService({
        mongoDb,
        refManager,
      }),
    );

    server.bind({
      Item, List,
    });

    server.expose('ItemService', Item);
    server.expose('ListService', List);

    server.route([
      ...(new ItemsRouter()).toArray(),
      ...(new ListsRouter()).toArray(),
    ]);

    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: ['makeen-db', 'makeen-core'],
};
