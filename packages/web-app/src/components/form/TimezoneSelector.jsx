import React from 'react';
import timezones from 'timezones.json';
import Select from './Select';

const timezoneOptions = timezones.map(({ value, text }) => ({ value, text }));

const TimezoneSelector = (props) => (
  <Select
    placeholder="Select timezone"
    search
    selection
    options={timezoneOptions}
    {...props}
  />
);

export default TimezoneSelector;
