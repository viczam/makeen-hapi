import React, { PropTypes } from 'react';
import form from 'hoc/form';
import Field from 'components/form/Field';
import Form from 'components/form/Form';
import Joi from 'joi';
import { TextArea } from 'semantic-ui-react';
import TimezoneSelector from 'components/form/TimezoneSelector';
import DatePicker from 'components/form/DatePicker';

const ProfileForm = ({
  handleSubmit,
}) => (
  <Form onSubmit={handleSubmit} className="large">
    <Field name="name" component="input" type="text" />
    <Field name="username" component="input" type="text" />
    <Field name="email" component="input" type="email" />
    <Field name="title" component="input" type="text" />
    <Field name="bio" component={TextArea} autoHeight />
    <Field name="birthdate" component={DatePicker} />
    <Field name="timezone" component={TimezoneSelector} />
    <button className="ui submit button" type="submit">Update</button>
  </Form>
);

ProfileForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default form({
  form: 'profile',
  schema: Joi.object().keys({
    username: Joi.string().trim().min(3).required(),
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    title: Joi.string(),
    bio: Joi.string(),
    timezone: Joi.string(),
  }),
})(ProfileForm);
