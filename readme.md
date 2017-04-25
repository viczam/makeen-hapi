Makeen
=======

A back-end development platform for rapid application development that is battle tested production ready.

Makeen promotes a pluggable architecture that allows you to use a broad range of pre-developed plugins which
provide all the functionality a modern application might need: user,  storage, mailing, database, REST API, documentation,
backend performance monitoring, CLI and cloud (AW & Azure) virtual instances mangement.

The majority of makeen plugins are hosted in the current mono-repository.

----------


Table of Contents
==============

* [Installation](#installation)
* [Usage](#usage)
*  [Demo](#demo)
*  [Makeen Plugins](#makeen-plugins)
	* [Octobus](https://github.com/makeen-project/octobus)
	* [Makeen Router](packages/makeen-router)
	* [Makeen Core](packages/makeen-core)
	* [Makeen Mailer](packages/makeen-mailer)
	* [Makeen User](packages/makeen-user)
	* [Makeen Storage](packages/makeen-storage)
	* [Makeen Monitoring](packages/makeen-monitoring)
	* [Makeen Documentation](packages/makeen-documentation)
	* [Makeen Virtual Machines](https://github.com/makeen-project/makeen-vm)
* [Build and Deployment](#build-and-deployment)
* [Contributing](#contributing)
* [Credits](#credits)
* [License](#license)
* [Get in Touch](#get-in-touch)


----------


## Installation

Before ramping up makeen the following requirements must be met:
 - Node v6 or higher version
 - mongodb connection

Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install:

- `git clone git@github.com:makeen-project/boilerplate.git`
- `npm install`

Running `npm run start` will start the following servers:
- development server - http://localhost:3001
- client server - http://localhost:3004
- web-app server - http://localhost:3000

Running the API
- API documentation will be available on- http://localhost:3001/documentation

Environment variables that override default mongodb uri 127.0.0.1:
 - MAKEEN_ENV_SERVER_CACHE_URI=mongodb://{ MONGO_URI }
 - MAKEEN_ENV_REGISTRATIONS_1_PLUGIN_OPTIONS_MONGODB_HOST={ MONGO_HOST_NAME }


From here on using a makeen plugin will require first installing it by way of npm:
- `npm install makeen-core`
- `npm install makeen-router`
- `npm install makeen-documentation`
- `npm install makeen-mailer`
- `npm install makeen-storage`
- `npm install makeen-monitoring`
- `npm install makeen-vm`

And load them whereve needed, be it inside a hapijs plugin or anywhere else server-side.

## Usage

The [Makeen boilerplate](https://github.com/makeen-project/boilerplate) is delivered as a feature-rich extensible backend [hapi.js](https://hapijs.com) server.

Architecture being modular you can write a new plugin and plug it into the server easily.

We will cover the plugin creation part in the [Demo](#demo) section but all you need to know is that a [hapi.js](https://hapijs.com) plugin is composed of `package.json` and `index.js` files with a register function and the rest is javascript logic.

Makeen as a whole is based on a few key **concepts and principles** which we'll discuss:

 - modular message driven arhitecture by way of [Octobus.js](https://github.com/makeen-project/octobus)
 - CRUD database operations on the fly
 - CRUD REST API endpoints on the fly
 - The Makeen `Plugin` - a full fledged hapi.js plugin generator

#### Modular message driven architecture by way of [Octobus.js](https://github.com/makeen-project/octobus)

Octobus.js is a library which promotes decoupling application logic into isolated modules and enabling cross-module interaction through a message driven approach.

As a basic example let's consider we have a monolithic block of code which implements math logic and currency logic and has the following two functions:

```js
// Math logic
const multiply(a, b) => {
  return a * b;
};

// Currency logic
const convertEuroToUsd => (euro) {
  const euroToUsdRate = 1.3;

  return multiply(euro, euroToUsdRate);
};
```

The above logic can be decoupled into Octobus services as following:

```js
const serviceBus = new ServiceBus();

serviceBus.subscribe('math.multiply', ({ message }) => {
  const { a, b } = message.data;

  return a * b;
});

serviceBus.subscribe('currency.convertEuroToUsd', ({ message, send }) => {
  const euroToUsdRate = 1.3;
  const {euro } = message.data;

  return send('math.currency', { a: euro, b: euroToUsdRate });
});

```

As you can see above implementation allows services to reside in different locations and removes hard dependency by relying on the dispatch function to execute all external actions.

This is just the tip of the iceberg but enough to give you a taste of the power and simplicity [Octobus.js](https://github.com/makeen-project/octobus) brings.

### CRUD database operations on the fly
Another important aspect when building backend logic is database access so you'll need to build logic that
connects to a database and performs both CRUD operations such as reading,creating,updating,deleting items and
custom operations.

The CRUD oparations bit can get huge and out of control if not centralized in a single common set of actions available for a mulltiple range of entities.

[Octobus-CRUD](https://github.com/makeen-project/octobus-crud) comes to the rescue and does just that.

The CRUD generator requires an entity schema and an [Octobus-mongodb-store](https://github.com/makeen-project/mongodb-store):

```js
const bookSchema = {
  title: Joi.string(),
  author: Joi.string(),
  description: Joi.string(),
  tableOfContents: Joi.array().items(
    Joi.object().keys({
      title: Joi.string(),
      page: Joi.string(),
    }),
  ),
  releaseDate: Joi.string(),
};
```

We're using Mongo so for the store we're going with [Octobus-mongodb-store](https://github.com/makeen-project/mongodb-store)
Makeen server exposes a server method that does just that:

```js
const { creteStore } = server.methods;
const store = createStore({ collectionName: 'TodoItem' })
```

At this point we have both `schema` and `store` so whe can go ahead and generate the Octobus CRUD service:

```js
import { CRUDServiceContainer } from 'octobus-crud';
import bookSchema from '../schemas/item';

// this class will expose all store methods
class BooksOctobusService extends CRUDServiceContainer {
  constructor({ store }) {
    super(store, bookSchema);
  }
}

const booksServiceBus = server.methods.createServiceBus('books');

const BooksRepository = serviceBus.register(
  new BooksOctobusService({ store }),
);

```

With just a few lines of code we've created the BooksRepository object which exposes **full CRUD database operations** and
can be used as following:

```js
const book = await BooksRepository.findOne({
  query: {
    name: 'Surely Youre Joking, Mr. Feynman!',
    author: 'Richard P. Feynman',
    },
  });
```

or

```js
const book = await dispatch('BooksRepository.find', {
  query: {
    name: 'Surely Youre Joking, Mr. Feynman!',
    author: 'Richard P. Feynman',
    },
  });
```

Voila! using the serviceBus or dispatch method you can trigger BooksRepository related logic from different locations
of the application without the need of importing or hard-requiring it.


#### CRUD REST API endpoints on the fly

Now that we've seen the power of octobus.js and the easy way of creating CRUD storage octobus services the last
required piece of functionality would be a set of REST API endpoints that would expose all this functionality.

This is easily accomplished using [makeen-router](packages/makeen-router) and it's exported class MongoResourceRouter

```js
class BooksRouter extends MongoResourceRouter {
  constructor(Repository, config = {}) {
    super(Repository, {
      namespace: 'BooksOctobusService',
      basePath: '/books',
      entitySchema: bookSchema,
      ...config,
    });
  }
}

const BooksRouter = new BooksRouter(BooksRepository);
BooksRouter.mount(server);
```

That's it! we now have a full range of CRUD endpoints operating from HTTP request down to the db level.

If we want to add new custom endpoints this is accomplished by adding new methods to the BooksRouter class and decorating it with the @route decorator:

```js
class BooksRouter extends MongoResourceRouter {
  constructor(Repository, config = {}) {
    super(Repository, {
      namespace: 'BooksOctobusService',
      basePath: '/books',
      entitySchema: bookSchema,
      ...config,
    });
  }

  @route({
    path: 'custom-endpoint-example',
    method: 'GET',
    config: {
      description: 'Example on how to create a new custom endpoint by using the @route decorator',
    },
  })
  customEndpointExample(request) {
    return this.Repository.findOne({ query: {} });
  }
}

const BooksRouter = new BooksRouter(BooksRepository);
BooksRouter.mount(server);
```

### The Makeen `Plugin` - a full fledged hapi.js plugin generator

The `Plugin` class is a central concept arround makeen plugins development.

The plugin can create a full CRUD service container and REST routes for you and also allow you to create and add custom service containers and routes. All this is being done by overidding the the `boot` method:

The bellow example will create a hapijs plugin containing BooksRepository service container and complete
REST CRUD routes:

```js
import { Plugin } from 'makeen-core';
class BooksPlugin extends Plugin {
  boot() {
    this.createResources('Books', {});
  }
}
```
It only took 6 lines of code and now you have a hapi plugin with CRUD REST endpoints and a CRUD db service container.

What if you want some custom service container and custom REST routes that go along with it ? for this we can instantiate the custom service container and CRUD REST router directly and pass them to the `createResources` method:

```js
import { Plugin } from 'makeen-core';
import BooksRouter from './routers/books';
import BooksRepositoryService from './services/books';

class BooksPlugin extends Plugin {
  boot() {
    const BooksRepository = new BooksRepositoryService({
      store: server.methods.createStore({ collectionName: 'Books' }),
    });

    this.createResources('Books', {
      repository: BooksRepository,
      router: new BooksRouter(BooksRepository),
    });
  }
}
```

----------


## Demo

Makeen is delivered as a set of feature-rich extensible plugins.

The architecture is modular and you can write your own custom plugin and load into a [Hapi.js](https://hapijs.com) server, to speed this part makeen also delivers a [boilerplate]([makeen-boilerplate](https://github.com/makeen-project/boilerplate) ) project but you can also create a custom [Hapi.js](https://hapijs.com) server if needed.

In order to see it in action we'll:
- rampup the [makeen-boilerplate](https://github.com/makeen-project/boilerplate) by following the provided instructions
- build a custom ToDo plugin by extending the `Plugin` class provided by [makeen-core](https://github.com/makeen-project/makeen/tree/develop/packages/makeen-core). This plugin will provide backend todo task management logic.

#### Step 1. Create the plugin package structure:

```js
> ./packages
>	todo/
>     src/
>       routers/
>         Items.js
>         Lists.js
>       schemas/
>         Item.js
>         List.js
>       services/
>         ItemRepository.js
>         ListRepository.js
>       index.js
>     package.json
```

#### Step 2. Define todo package main entities and their data schema

We will be working with items and item lists thus we have Item and List entities.

Item schema will be:

```js
_id: Joi.object(),
accountId: Joi.object().required(),
listId: Joi.object().required(),
assignedTo: Joi.object().allow(null),

title: Joi.string().trim().required(),
description: Joi.string().allow(null),
isChecked: Joi.boolean().default(false),

createdBy: Joi.object(),
startDate: Joi.date(),
dueDate: Joi.date(),
createdAt: Joi.date(),
updatedAt: Joi.date(),
```


  List schema will be:

```js _id: Joi.object(),
accountId: Joi.object().required(),
name: Joi.string().required(),
createdBy: Joi.object(),
createdAt: Joi.date(),
updatedAt: Joi.date(),
```


#### Step 3. Create octobus based services for Item and List

  Create `./packages/todo/src/services/ItemRepository.js` file
  We will be using a octobus-crud package in order to generate a full fledged database integrated CRUD set of actions:

```js
    import { CRUDServiceContainer } from 'octobus-crud';
    import itemSchema from '../schemas/item';

    class ItemRepository extends CRUDServiceContainer {
      constructor({ store }) {
        super(store, itemSchema);
      }
    }

    export default ItemRepository;
```
The CRUDServiceContainer class takes in a store and the entity schema and will create an object with: create, read, update and delete methods



Create `./packages/todo/src/services/ListRepository.js` file

Same as with the Item service we will generate the List service but because the List entity references and logically owns Items
we will need to overwrite the delete method such that it removes all child Item entities.

custom method deleteOne will be:
```js
      async deleteOne(params) {
        const ItemRepository = this.extract('ItemRepository');
        const { query } = params;
        const list = await this.findOne({ query });
        const result = await CRUDServiceContainer.prototype.deleteOne.call(this, params);

        await Promise.all([
          ItemRepository.deleteMany({
            query: {
              listId: list._id,
            },
          }),
        ]);

        return result;
      }
```
The custom deleteOne method first removes the queries List and next it removes all Item entties that are referencing this list.

At this point we have created Item and List octobus services with all CRUD methods.

The next step will be to create HTTP endpoints for all of this methods such that they are accesible to the rest of the world through HTTP requests.


#### Step 4. Create HTTP endpoints for Item and List CRUD operations

For this we will be using the [makeen-router](packages/makeen-router) package which takes in a generated octobus CRUD repository and builds all the CRUD endpoints
based on it:


Makeen-core provides Router and MongoResourceRouter classes;
By extending the Router class you can define hapijs routes as class methods as following:

```js
class TestRouter extends Router {
  constructor() {
    super({ basePath: 'test-router' });
  }

  @route({
    method: 'GET',
    path: '/test/route',
  })
  testRoute() {
    ...
  }
}

const testRouter = new TestRouter();
testRouter.mount(server);
```


By extending the MongoResourceRouter class you can define a full set of CRUD routes, all you need to do is provide
a octboud CRUD repository:

```js
class CRUDTestRouter extends MongoResourceRouter {
  constructor(Repository, config) {
    super(Repository, {
      namespace: 'TestRouter',
      basePath: '/test/router',
      entitySchema: joiSchema,
    });
  }
}

const crudTestRouter = new CRUDTestRouter();
crudTestRouter.mount(server);

```
That's it! by mounting the newly created CRUDTestRouter class instance to the server we now have a complete CRUD API available.


So let's see how this would look for the Item and List entities:

```js
class ItemsRouter extends MongoResourceRouter {
  constructor(ItemRepository, config = {}) {
    super(ItemRepository, {
      namespace: 'TodoItems',
      basePath: '/lists/{listId}/items',
      entitySchema: omit(itemSchema, [
        '_id', 'accountId', 'listId', 'createdBy', 'createdAt', 'updatedAt',
      ]),
      ...config,
    });
  }
```
```js
class ListsRouter extends MongoResourceRouter {
  constructor(ListRepository, config = {}) {
    super(ListRepository, {
      namespace: 'TodoLists',
      basePath: '/lists',
      entitySchema: omit(listSchema, [
        '_id', 'createdBy', 'createdAt', 'updatedAt', 'accountId',
      ]),
      ...config,
    });
  }

  @route.get({
    path: 'find-with-stats',
    method: 'GET',
    config: {
      description: 'Find lists with stats and items',
    },
  })
  findWithStats(request) {
    const accountId = objectId(request.auth.credentials.accountId);

    return this.ListRepository.findManyWithStats({
      query: { accountId },
    });
  }
}
```
Above you can see another [makeen-router](packages/makeen-router) feature, the @route function decorator which takes in metadata and transforms
a simple function into a hapi HTTP endpoint, in above case we've used it to create a custom endpoint.




And finally, once we have Octbus CRUD repositories and [makeen-router](packages/makeen-router) CRUD routers we need to assemble all this and
bootstrap it in the plugin index.js file.

#### Step 6. Create new ToDo Plugin class

```js
import { Plugin } from 'makeen-core';
import ItemRepositoryService from './services/ItemRepository';
import ListRepositoryService from './services/ListRepository';
import ItemsRouter from './routers/Items';
import ListsRouter from './routers/Lists';

// Creating a Todo makeen plugin by extending the existing Plugin class
class ToDoPlugin extends Plugin {
  // boot function called on plugin register
  // inside it we create our service containers and routers
  async boot(server) {
    // register item service container
    const ItemRepository = serviceBus.register(
      new ItemRepositoryService({
        // pass in data store
        store: server.methods.createStore({ collectionName: 'TodoItem' }),
      }),
    );

    this.createResource('Item', {
      repository: ItemRepository,
      router: new ItemsRouter(ItemRepository),
    });

    // register list service container
    const ListRepository = serviceBus.register(
      new ListRepositoryService({
        store: server.methods.createStore({ collectionName: 'TodoList' }),
      }),
    );

    this.createResource('Item', {
      repository: ListRepository,
      router: new ListsRouter(ListRepository),
    });

    server.bind({
      ItemRepository,
      ListRepository,
    });
  }
}
```

#### Step 5. Bootstrap the todo plugin

 Create `./packages/todo/src/index.js` file

Inside it we import the service and router files and add the hapijs register function:

```js
export async function register(server, options, next) {
  // create new instance of ToDoPlugin class
  const toDoPlugin = new TodoPlugin({});

  // register newly created plugin
  server.register([toDoPlugin], next);
}
```

----------


## Makeen Plugins

Makeen forms an echosistem of hapijs plugins that combined togheter can provide a full-range of
functionalities required from a full stack profesional web application:

* [Octobus](https://github.com/makeen-project/octobus)
* [Makeen Router](packages/makeen-router)
* [Makeen Core](packages/makeen-core)
* [Makeen Mailer](packages/makeen-mailer)
* [Makeen User](packages/makeen-user)
* [Makeen Storage](packages/makeen-storage)
* [Makeen Monitoring](packages/makeen-monitoring)
* [Makeen Documentation](packages/makeen-documentation)
* [Makeen Virtual Machines](https://github.com/makeen-project/makeen-vm)


----------

## Build and Deployment

Lorem ipsum dolor sit amet, an civibus partiendo interpretaris sed, paulo mucius ut vim. In diceret propriae reformidans est, et nec fabellas deserunt quaestio, ut agam laudem reprehendunt vix. Usu ex veritus accusamus. Duo an choro voluptaria, diceret graecis vivendo ex has.

----------

## Contributing

You can contribute by:
- creating a github issue
- creating a github pull request
- [getting in touch](#get-in-touch)

----------

## Credits

Meet the swiss-army team behind Makeen:

- [Abdul Masri](https://github.com/abdulmasri)
- [Ameer Al Sayyed]( https://github.com/Ameerplus)
- [Catalin Rizea](https://github.com/catarizea)
- [Dan Ochiana](https://github.com/danmo)
- [Nick Burke](https://github.com/neekz0r)
- [Nicolas Embleton](https://github.com/nicolasembleton)
- [Olya Surits](https://www.linkedin.com/in/olyasurits)
- [Victor Zamfir](https://github.com/viczam)

----------

## License

Makeen is licensed under the [MIT license](LICENSE).

----------

## Get in Touch

What are you waiting for ? let us know what you think on:
- StackOverflow
- Twitter
- Slack
- [Reddit](https://www.reddit.com/r/makeen/)


