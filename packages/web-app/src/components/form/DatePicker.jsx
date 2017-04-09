import 'react-date-picker/index.css';
import React, { PropTypes } from 'react';
import { DateField } from 'react-date-picker';

const DatePicker = ({ value, onChange, ...restProps }) => (
  <DateField
    dateFormat="YYYY-MM-DD"
    value={value}
    onChange={onChange}
    updateOnDateClick
    collapseOnDateClick
    style={{
      borderWidth: 0,
    }}
    {...restProps}
  />
);

DatePicker.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DatePicker;
