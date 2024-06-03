import React from 'react';
import PropTypes from 'prop-types';

function Checkbox({
  label, checked, onChange, title,
}) {
  return (
    <label title={title}>
      <input type="checkbox" checked={checked} onChange={onChange} title={title} />
      {label}
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Checkbox;
