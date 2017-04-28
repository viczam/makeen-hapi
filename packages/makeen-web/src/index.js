import { Plugin } from 'makeen-core';
import H2O2 from 'h2o2';
import next from 'next';
import MainRouter from './routers/Main';
import schema from './schemas/pluginOptions';

class WebPlugin extends Plugin {
  constructor() {
    super({
      schema,
      name: 'Web',
      plugins: [H2O2],
      autoCreateServiceBus: false,
      dependencies: [],
    });

    this.register.attributes.pkg.name = 'makeen-web';
  }

  async boot(server, options) {
    const isDev = typeof options.isDev !== 'undefined' ||
      process.env.NODE_ENV === 'development';

    this.app = next({
      dev: isDev,
      dir: options.appDir,
    });

    await this.app.prepare();

    this.mountRouters([
      new MainRouter({
        ...(this.options || {}),
        app: this.app,
      }),
    ]);
  }
}

export const { register } = new WebPlugin();
