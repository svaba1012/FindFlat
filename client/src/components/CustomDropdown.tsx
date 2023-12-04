import React from "react";

interface CustomDropdownProps {
  id: string;
  data: string[];
  label: string;
  inputProps: any;
  selectLabel: string;
  validationError: any;
}

function CustomDropdown({
  id,
  data,
  label,
  inputProps,
  selectLabel,
  validationError,
}: CustomDropdownProps) {
  return (
    <div>
      <label className="form-label tw-mb-0 " htmlFor={id}>
        {label}
      </label>
      <select
        className="form-select tw-mb-3"
        aria-label="Default select example"
        id={id}
        {...inputProps}
        defaultValue={data[0]}
      >
        {/* <option selected>{selectLabel}</option> */}
        {data.map((el, i) => {
          return (
            <option value={el} key={i}>
              {el}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default CustomDropdown;
