import trimEnd from 'lodash/trimEnd';
import findByIdRoute from '../routes/findById';
import findManyRoute from '../routes/findMany';
import findOneRoute from '../routes/findOne';
import createOneRoute from '../routes/createOne';
import replaceOneRoute from '../routes/replaceOne';
import updateOneRoute from '../routes/updateOne';
import deleteOneRoute from '../routes/deleteOne';
import deleteOneByIdRoute from '../routes/deleteOneById';
import countRoute from '../routes/count';

export default ({
  entityName,
  entityNs = 'entity',
  schema,
  pathPrefix,
  config = {},
}) => {
  const baseOptions = {
    entityName,
    entityNs,
    config,
  };
  const basePath = `${trimEnd(pathPrefix, '/')}`;

  const findById = findByIdRoute({ ...baseOptions, path: `${basePath}/{id}` });
  const findMany = findManyRoute({ ...baseOptions, path: basePath });
  const findOne = findOneRoute({ ...baseOptions, path: `${basePath}/findOne` });
  const createOne = createOneRoute({ ...baseOptions, path: basePath, schema });
  const replaceOne = replaceOneRoute({ ...baseOptions, path: `${basePath}/{id}`, schema });
  const updateOne = updateOneRoute({ ...baseOptions, path: `${basePath}/{id}` });
  const deleteOne = deleteOneRoute({ ...baseOptions, path: `${basePath}/deleteOne` });
  const deleteOneById = deleteOneByIdRoute({ ...baseOptions, path: `${basePath}/{id}` });
  const count = countRoute({ ...baseOptions, path: `${basePath}/count` });

  return {
    findById,
    findMany,
    findOne,
    createOne,
    replaceOne,
    updateOne,
    count,
    deleteOne,
    deleteOneById,
  };
};
