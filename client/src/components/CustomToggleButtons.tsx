import React from "react";

function CustomToggleButtons(props) {
  return (
    <div
      className="btn-group tw-mt-6"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        checked
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio1">
        Radio 1
      </label>

      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
      />
      <label className="btn btn-outline-primary" htmlFor="btnradio2">
        Radio 2
      </label>
    </div>
  );
}

export default CustomToggleButtons;
