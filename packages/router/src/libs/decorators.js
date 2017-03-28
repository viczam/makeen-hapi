const route = (definition) => (target, propr, descriptor) => {
  Object.assign(descriptor, {
    enumerable: true,
  });

  Object.assign(descriptor.value, {
    isRoute: true,
    definition,
  });

  return descriptor;
};

['get', 'post', 'put', 'patch', 'delete', 'head'].forEach((method) => {
  route[method] = (definition) => route({
    ...definition,
    method,
  });
});

export {
  route,
};
