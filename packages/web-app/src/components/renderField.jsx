import React, { PropTypes } from 'react';

const renderField = (InputComponent) => {
  const Field = ({ input, meta, ...props }) => {
    console.log(meta);

    return (
      <div>
        <InputComponent
          {...props}
          {...input}
        />

        {meta.touched && meta.error &&
          <div className="ui error message">
            <p>{meta.error}</p>
          </div>
        }
      </div>
    );
  };

  Field.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
  };

  return Field;
};

export default renderField;
