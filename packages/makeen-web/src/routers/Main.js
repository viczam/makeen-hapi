import { Router } from 'makeen-router';

class MainRouter extends Router {
  constructor({ assetsPath, app }, config = {}) {
    super({
      namespace: 'WebMain',
      basePath: '/',
      ...config,
    });

    const nextHandler = ({ raw, url }, reply) =>
      app.getRequestHandler()(raw.req, raw.res, url).then(() => {
        reply.close(false);
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

    this.addRoute('next', {
      path: '/{p*}',
      method: 'GET',
      handler: nextHandler,
      config: {
        auth: false,
      },
    });
  }
}

export default MainRouter;
