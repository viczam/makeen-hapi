import React, { PropTypes } from 'react';
import { Field } from 'redux-form';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';
import { Label } from 'semantic-ui-react';

const FormField = (props) => {
  const {
    input,
    meta,
    isRequired,
    controlComponent: ControlComponent,
    hideLabel,
    hideErrors,
    ...restProps
  } = props;
  const isError = meta.touched && meta.error;
  const label = props.label || upperFirst(input.name);

  return (
    <div className={classNames('field', isError && 'error')}>
      {!hideLabel && label && <label htmlFor="">{label}{isRequired && '*'}</label>}
      <ControlComponent {...restProps} {...input} />

      {isError && !hideErrors &&
        <Label basic color="red" pointing>{meta.error.message}</Label>
      }
    </div>
  );
};

FormField.propTypes = {
  isRequired: PropTypes.bool,
  hideLabel: PropTypes.bool,
  hideErrors: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  controlComponent: PropTypes.any.isRequired,
};

FormField.defaultProps = {
  isRequired: false,
  hideErrors: false,
  hideLabel: false,
  label: '',
};

const FormFieldWrapper = ({ component: controlComponent, ...restProps }) => (
  <Field
    component={FormField}
    controlComponent={controlComponent}
    {...restProps}
  />
);

FormFieldWrapper.propTypes = {
  component: PropTypes.any.isRequired,
};

export default FormFieldWrapper;
