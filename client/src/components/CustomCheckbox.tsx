import React from "react";

function CustomCheckbox({ id, label, inputProps }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id={id}
        {...inputProps}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default CustomCheckbox;
