export const createActionCreator = (type, ...argNames) =>
  (...args) => {
    const action = { type, payload: {} };
    argNames.forEach((arg, index) => {
      action.payload[argNames[index]] = args[index];
    });

    return action;
  };

export const createAPIActionTypes = ({ namespace = '', type }) => {
  const prefix = `${namespace ? `${namespace}/` : ''}${type.toUpperCase()}`;

  return [
    `${prefix}_REQUEST`,
    `${prefix}_SUCCESS`,
    `${prefix}_FAILURE`,
    `${prefix}_RESET`,
  ];
};

export const createReducer = (initialState, handlers) =>
  (state = initialState, action) => {
    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }

    return state;
  };

export const createReducerForAction = (actionType, initialState) =>
  (state = initialState, action) => {
    if (action.type === actionType) {
      return action.payload;
    }

    return state;
  };

const hasValidTypes = types =>
  Array.isArray(types) &&
  types.length === 4 &&
  types.every(type => typeof type === 'string');

export const createAPIReducerHandlers = types => {
  if (!hasValidTypes(types)) {
    throw new Error('Expected an array of three string types.');
  }

  const [REQUEST, SUCCESS, FAILURE, RESET] = types;

  return {
    [REQUEST]: state => ({
      ...state,
      isFetching: true,
      error: null,
      response: null,
    }),

    [SUCCESS]: (state, { payload }) => ({
      ...state,
      isFetching: false,
      response: payload,
      error: null,
    }),

    [FAILURE]: (state, { error }) => ({
      ...state,
      isFetching: false,
      error,
    }),

    [RESET]: () => ({
      isFetching: false,
      error: null,
      response: null,
    }),
  };
};

export const createAPIReducer = (initialState = {}, types) =>
  createReducer(
    {
      isFetching: false,
      error: null,
      response: null,
      ...initialState,
    },
    createAPIReducerHandlers(types),
  );

export const combineSelectors = name =>
  selectors =>
    Object.keys(selectors).reduce(
      (acc, selector) => ({
        ...acc,
        [selector]: state => selectors[selector](state[name]),
      }),
      {},
    );

export const combineSelectorGroups = groups =>
  Object.keys(groups).reduce(
    (acc, groupName) => ({
      ...acc,
      [groupName]: combineSelectors(groupName)(groups[groupName]),
    }),
    {},
  );
