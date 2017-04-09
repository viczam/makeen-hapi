import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';

const ResetPasswordForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit}>
    <Field name="usernameOrEmail" label="Username or email" component="input" type="text" />
    <button className="ui button" type="submit">Submit!</button>
  </Form>
);

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'register',
  schema: Joi.object().keys({
    usernameOrEmail: Joi.string().required(),
  }),
})(ResetPasswordForm);
