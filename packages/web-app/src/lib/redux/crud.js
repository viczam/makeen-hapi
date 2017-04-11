import {
  createAPIActionTypes,
  createReducer,
  createAPIReducer,
} from './helpers';

export const createActionTypes = namespace => ({
  CREATE_ONE: createAPIActionTypes({ namespace, type: 'CREATE_ONE' }),
  FIND_BY_ID: createAPIActionTypes({ namespace, type: 'FIND_BY_ID' }),
  FIND_ONE: createAPIActionTypes({ namespace, type: 'FIND_ONE' }),
  FIND_MANY: createAPIActionTypes({ namespace, type: 'FIND_MANY' }),
  REPLACE_ONE: createAPIActionTypes({ namespace, type: 'REPLACE_ONE' }),
  UPDATE_ONE: createAPIActionTypes({ namespace, type: 'UPDATE_ONE' }),
  DELETE_ONE: createAPIActionTypes({ namespace, type: 'DELETE_ONE' }),
  DELETE_ONE_BY_ID: createAPIActionTypes({
    namespace,
    type: 'DELETE_ONE_BY_ID',
  }),
  COUNT: createAPIActionTypes({ namespace, type: 'COUNT' }),
});

export const createActionCreators = (
  {
    actionTypes: {
      CREATE_ONE,
      FIND_BY_ID,
      FIND_ONE,
      FIND_MANY,
      REPLACE_ONE,
      UPDATE_ONE,
      DELETE_ONE,
      DELETE_ONE_BY_ID,
      COUNT,
    },
    pathPrefix,
  },
) => ({
  createOne: data => ({
    types: CREATE_ONE,
    payload: {
      request: {
        url: pathPrefix,
        method: 'post',
        data,
      },
    },
  }),

  findById: id => ({
    types: FIND_BY_ID,
    payload: {
      request: {
        url: `${pathPrefix}/${id}`,
        method: 'get',
      },
    },
  }),

  findOne: query => ({
    types: FIND_ONE,
    payload: {
      request: {
        url: `${pathPrefix}/findOne`,
        method: 'get',
        params: {
          query,
        },
      },
      query,
    },
  }),

  findMany: ({ query, offset, limit, orderBy, fields } = {}) => ({
    types: FIND_MANY,
    payload: {
      request: {
        url: pathPrefix,
        method: 'get',
        params: { query, offset, limit, orderBy, fields },
      },
    },
  }),

  replaceOne: (id, data) => ({
    types: REPLACE_ONE,
    payload: {
      request: {
        url: `${pathPrefix}/${id}`,
        method: 'put',
        data,
      },
      data,
    },
  }),

  updateOne: (id, data) => ({
    types: UPDATE_ONE,
    payload: {
      request: {
        url: `${pathPrefix}/${id}`,
        method: 'patch',
        data,
      },
      id,
      data,
    },
  }),

  deleteOne: _id => ({
    types: DELETE_ONE,
    payload: {
      request: {
        url: `${pathPrefix}/deleteOne`,
        method: 'delete',
        data: {
          query: {
            _id: {
              $oid: _id,
            },
          },
        },
      },
      _id,
    },
  }),

  deleteOneById: _id => ({
    types: DELETE_ONE_BY_ID,
    payload: {
      request: {
        url: `${pathPrefix}/${_id}`,
        method: 'delete',
      },
      _id,
    },
  }),

  count: (query = {}) => ({
    types: COUNT,
    payload: {
      request: {
        url: `${pathPrefix}/count`,
        method: 'get',
        params: {
          query,
        },
      },
    },
  }),
});

export const createEntitiesReducers = (
  {
    actionTypes: {
      CREATE_ONE,
      FIND_BY_ID,
      FIND_ONE,
      FIND_MANY,
      REPLACE_ONE,
      UPDATE_ONE,
      DELETE_ONE,
      DELETE_ONE_BY_ID,
      COUNT,
    },
  },
) => {
  const entityReducer = (state, { payload }) => ({
    ...state,
    [payload.data._id]: payload.data,
  });

  const entities = createReducer(
    {},
    {
      [CREATE_ONE[1]]: entityReducer,
      [FIND_BY_ID[1]]: entityReducer,
      [FIND_ONE[1]]: entityReducer,
      [FIND_MANY[1]]: (state, { payload }) =>
        payload.data.reduce(
          (acc, item) => ({
            ...acc,
            [item._id]: item,
          }),
          state,
        ),
      [REPLACE_ONE[1]]: entityReducer,
      [UPDATE_ONE[1]]: (state, { meta }) => ({
        ...state,
        [meta.previousAction.payload.id]: {
          ...(state[meta.previousAction.payload.id] || {}),
          ...(meta.previousAction.payload.data || {}),
        },
      }),
      [DELETE_ONE[1]](state, { meta }) {
        const nextState = { ...state };
        delete nextState[meta.previousAction.payload._id];
        return nextState;
      },
      [DELETE_ONE_BY_ID[1]](state, { meta }) {
        const nextState = { ...state };
        delete nextState[meta.previousAction.payload._id];
        return nextState;
      },
    },
  );

  const addEntityId = (state, { payload }) => {
    if (state.includes(payload.data._id)) {
      return state;
    }
    return state.concat([payload.data._id]);
  };

  const ids = createReducer([], {
    [CREATE_ONE[1]]: (state, { payload }) => state.concat([payload.data._id]),
    [FIND_ONE[1]]: addEntityId,
    [FIND_BY_ID[1]]: addEntityId,
    [FIND_MANY[1]]: (state, { payload }) =>
      state.concat(
        payload.data
          .filter(item => !state.includes(item._id))
          .map(({ _id }) => _id),
      ),
    [DELETE_ONE[1]]: (state, { meta }) =>
      state.filter(item => item !== meta.previousAction.payload._id),
    [DELETE_ONE_BY_ID[1]]: (state, { meta }) =>
      state.filter(item => item !== meta.previousAction.payload._id),
  });

  const count = createReducer(0, {
    [COUNT[1]]: (state, { payload }) => parseInt(payload.data, 10),
  });

  return {
    entities,
    ids,
    count,
  };
};

export const createAPIReducers = actionTypes =>
  Object.keys(actionTypes).reduce(
    (acc, actionType) => ({
      ...acc,
      [actionType]: createAPIReducer({}, actionTypes[actionType]),
    }),
    {},
  );

export const createIdsReducerMap = (
  {
    key,
    actionTypes,
  },
) => {
  const itemReducer = (state, { payload }) => ({
    ...state,
    [payload.data[key]]: [
      ...(state[payload.data[key]] || []),
      payload.data._id,
    ],
  });

  const findManyReducer = (state, { payload }) => ({
    ...state,
    ...payload.data.reduce(
      (acc, item) => itemReducer(acc, { payload: { data: item } }),
      {},
    ),
  });

  const deleteOneReducer = (state, { meta }) =>
    Object.keys(state).reduce(
      (acc, stateKey) => ({
        ...acc,
        [stateKey]: (state[stateKey] || [])
          .filter(item => item !== meta.previousAction.payload._id),
      }),
      {},
    );

  return createReducer(
    {},
    {
      [actionTypes.CREATE_ONE[1]]: itemReducer,
      [actionTypes.FIND_ONE[1]]: itemReducer,
      [actionTypes.FIND_BY_ID[1]]: itemReducer,
      [actionTypes.FIND_MANY[1]]: findManyReducer,
      [actionTypes.DELETE_ONE[1]]: deleteOneReducer,
      [actionTypes.DELETE_ONE_BY_ID[1]]: deleteOneReducer,
    },
  );
};
