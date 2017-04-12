import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';

const SignUpForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit}>
    <div className="ui stacked segment">
      <Field name="name" component="input" type="text" />
      <Field name="username" component="input" type="text" />
      <Field name="email" component="input" type="email" />
      <Field name="password" component="input" type="password" />
      <Field name="confirmPassword" label="Confirm Password" component="input" type="password" />
      <button className="ui button" type="submit">Register!</button>
    </div>
  </Form>
);

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'signUp',
  schema: Joi.object().keys({
    username: Joi.string().trim().min(3).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
})(SignUpForm);
