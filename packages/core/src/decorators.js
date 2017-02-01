export const withUserstamp = handler => (args) => {
  const { params } = args;
  const { user, ...nextParams } = params;

  if (!user || !user._id) {
    return handler(args);
  }

  nextParams.updatedBy = user._id;

  if (!params._id) {
    nextParams.createdBy = user._id;
  }

  return handler({
    ...args,
    params: nextParams,
  });
};
