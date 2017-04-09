import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';

const ResetPasswordForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit}>
    <Field name="password" component="input" type="password" />
    <Field name="confirmPassword" label="Confirm Password" component="input" type="password" />
    <button className="ui button" type="submit">Submit!</button>
  </Form>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'register',
  schema: Joi.object().keys({
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  }),
})(ResetPasswordForm);
