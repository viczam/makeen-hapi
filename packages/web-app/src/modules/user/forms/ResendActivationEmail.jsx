import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';

const ResendActivationEmailForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit}>
    <Field name="email" component="input" type="email" />
    <button className="ui button" type="submit">Submit!</button>
  </Form>
);

ResendActivationEmailForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'resendActivationEmail',
  schema: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
})(ResendActivationEmailForm);
