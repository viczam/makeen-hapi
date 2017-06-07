Makeen Router
================

#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-router`

## Benefits
1. Define the routes using annotations. The focus is shifted to handler, instead of configuration, which becomes metadata attached to it.

2. Group the routes together using classes so that they can share configuration and functionality (methods, helpers etc).

3. Better support for async / await - your handlers are methods that have to **return** a result (you can still call *reply*, but you won't need in most of the cases).
```js
class DemoRouter extends Router {
  @route.get({
    path: '/users/{id}',
    config: {
      validate: {
        params: {
          id: Joi.number().required(),
        },
      },
    },
  })
  async sayHello(request) {
    const { id } = request.params;
    const user = await this.users.findById(id);
    if (!user) {
      throw Boom.notFound(`Unable to find user with id "${id}"!`);
    }
    return `Hello, ${user.name}!`;
  }
}
```

4. Make you dependencies explicit by sending them in the constructor of the class or through setter methods.
```js
class UsersRouter extends Router {
  constructor({
    UserRepository,
  }) {
    super({
      namespace: 'Users',
      basePath: '/users',
    });

    this.UserRepository = UserRepository;
  }
}

const usersRouter = new UsersRouter({ UserRepository });
usersRouter.mount(server);
```

5. Sensible defaults. Method names will become routes' ids (unless specified explicitly).

6. Building specialized routing classes with predefined functionality. Check MongoResourceRouter that will expose a REST interface for a specified resource.

7. Manipulating routes configuration before they get mounted to a server (by overwriting one of the `addRoute` / `mount` / `toArray` methods).

-----------------
## Roadmap:
- nesting routers will be made easier; this way building nested restful resources like `/lists/{listId}/items` will be easier.



Because Makeen is a collection of plugins you will need a [Hapi.js](https://hapijs.com/) server to load and run them. To speed things up Makeen is providing the server component in the shape of a [boilerplate](https://github.com/makeen-project/boilerplate) which you can clone and install.