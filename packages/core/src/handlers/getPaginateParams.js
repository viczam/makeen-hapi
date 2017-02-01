export default (request, reply) => {
  const params = {};

  if (request.query.offset) {
    params.skip = parseInt(request.query.offset, 10);
  }

  if (request.query.limit) {
    params.limit = parseInt(request.query.limit, 10);
  }

  reply(params);
};
