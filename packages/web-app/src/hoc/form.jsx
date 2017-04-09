import { reduxForm } from 'redux-form';
import Joi from 'joi';

const createValidate = (schema) => (values) => {
  const { error } = Joi.validate(values, schema, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (!error) {
    return {};
  }

  return (error.details || []).reduce((acc, err) => ({
    ...acc,
    // [err.path]: (acc[err.path] || []).concat([err]),
    [err.path]: err,
  }), {});
};

const parseOptions = ({ schema, ...options }) => {
  const additionalOptions = {};

  if (schema) {
    additionalOptions.validate = createValidate(schema);
  }

  return {
    touchOnBlur: false,
    touchOnChange: true,
    ...options,
    ...additionalOptions,
  };
};

export default (options) => reduxForm(parseOptions(options));
