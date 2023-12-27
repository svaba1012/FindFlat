import React, { ReactElement } from "react";

interface CustomInputProps {
  icon?: ReactElement;
  id: string;
  inputProps: any;
  label: string;
  validationError: any;
}

function CustomInput({
  icon,
  id,
  inputProps,
  validationError,
  label,
}: CustomInputProps) {
  let isInvalid = !!validationError;

  let inputStyleClasses = isInvalid
    ? "form-control is-invalid"
    : "form-control";

  let inputGroupStyleClasses = isInvalid
    ? "input-group has-validation tw-mb-3 "
    : "input-group tw-mb-3";

  let labelStyleClasses = isInvalid
    ? "form-label tw-mb-0 "
    : "form-label tw-mb-0";

  const renderValidationMsg = () => {
    if (isInvalid) {
      return (
        <div id={id + "Validation"} className="invalid-feedback tw-basis-full ">
          *{validationError.message}
        </div>
      );
    }
  };

  if (!icon) {
    return (
      <>
        <label className={labelStyleClasses} htmlFor={id}>
          {label}
        </label>
        <input
          className={inputStyleClasses}
          aria-describedby={id + "Validation"}
          {...inputProps}
          id={id}
        />
        {renderValidationMsg()}
      </>
    );
  }

  return (
    <>
      <label className={labelStyleClasses} htmlFor={id}>
        {label}
      </label>
      <div className={inputGroupStyleClasses}>
        <span className="input-group-text" id={id + "addon-wrapping"}>
          {icon}
        </span>

        <input
          className={inputStyleClasses}
          aria-describedby={id + "addon-wrapping " + id + "Validation"}
          {...inputProps}
          id={id}
        />

        {renderValidationMsg()}
      </div>
    </>
  );
}

export default CustomInput;
