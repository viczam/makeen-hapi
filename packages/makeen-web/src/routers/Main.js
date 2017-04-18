import { Router } from 'makeen-router';

class MainRouter extends Router {
  constructor(
    {
      assetsPath,
    },
    config = {},
  ) {
    super({
      namespace: 'WebMain',
      basePath: '/',
      ...config,
    });

    this.addRoute('assets', {
      path: '/assets/{path*}',
      method: 'GET',
      handler: {
        directory: {
          path: assetsPath,
          index: false,
        },
      },
    });

    this.addRoute('api', {
      path: '/api/{path*}',
      method: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      handler: {
        proxy: {
          mapUri(request, cb) {
            const requestPath = request.url.path.replace('/api', '');
            cb(null, `${request.server.settings.app.api}${requestPath}`);
          },
          passThrough: true,
        },
      },
      config: {
        id: null,
      },
    });

    this.addRoute('home', {
      path: '/{path*}',
      method: 'GET',
      handler: {
        view: 'Home',
      },
    });
  }
}

export default MainRouter;
