A makeen plugin is also a node module.

If you want it to be a hapi plugin too, there are some conventions we recommend:

1) File structure:

```
- src
- - constants
- - - index.js
- - - some-constants.js
- - - lib
- - routers
- - - MyRouter.js
- - schemas
- - - pluginOptions.js
- - - otherSchema.js
- - services
- - - MyService.js
- - index.js
```

- `src/constants` - a directory where you can group constants by file
- `src/routers` - here you can define Router classes (check makeen-router)
- `src/schemas` - directory to host Joi schemas
- `src/services` - directory to host Octobus service containers (classes)
- `src/index.js` - bootstrap file

The minimum required code for your `src/index.js` file is:

```js
import Joi from 'joi';
import pkg from '../package.json';
import pluginOptionsSchema from './schemas/pluginOptions';

export async function register(server, options, next) {
  try {
    const pluginOptions = Joi.attempt(options, pluginOptionsSchema);
    // ...
    next();
  } catch (err) {
    next(err);
  }
}

register.attributes = {
  pkg,
  dependencies: [],
};

```

The build process will create a `/build` directory that will contain your javascript code compiled through babel. You can find the babel configuration in the `.babelrc` file at the root of the project.

Whenever you want to (npm) publish a new version of your plugin, make sure you ran build over it.