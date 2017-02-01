export default (route, generateContext) => (request, reply) => {
  const context = generateContext(request);

  switch (route) {
    case 'count':
    case 'deleteOne':
    case 'deleteOneById':
    case 'findById':
    case 'findOne':
      Object.assign(request.pre.query, context);
      break;
    case 'createOne':
      Object.assign(request.pre.payload, context);
      break;
    case 'findMany':
      Object.assign(request.pre.queryParams.query, context);
      break;
    case 'replaceOne':
    case 'updateOne':
      Object.assign(request.pre.query, context);
      Object.assign(request.pre.payload, context);
      break;
    default:
  }

  reply();
};
