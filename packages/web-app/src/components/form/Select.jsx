import React, { PropTypes } from 'react';
import { Dropdown } from 'semantic-ui-react';

const Select = ({ value, onChange, ...restProps }) => (
  <Dropdown
    onChange={(e, element) => onChange(element.value)}
    value={value}
    {...restProps}
  />
);

Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  onChange: PropTypes.func,
};

export default Select;
