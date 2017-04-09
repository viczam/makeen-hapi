import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';

const LoginForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit} className="large">
    <div className="ui stacked segment">
      <Field name="username" component="input" type="text" />
      <Field name="password" component="input" type="password" />
      <button className="ui submit button" type="submit">Login!</button>
    </div>
  </Form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'login',
  schema: Joi.object().keys({
    username: Joi.string().trim().min(3).required(),
    password: Joi.string().required(),
  }),
})(LoginForm);
