import * as React from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 0.1;
const MIN = 0;
const MAX = 100;

const CustomDualSlider = ({
  rtl,
  id,
  min,
  max,
  step,
  measureUnit,
  values,
  setValues,
  label,
}) => {
  let decimalPlace = step < 1 ? 1 : 0;
  const renderValues = () => {
    let maxVal = values[1].toFixed(decimalPlace);
    if (values[1] == max) {
      maxVal = values[1].toFixed(decimalPlace) + "+";
    }
    return (
      <>
        ({values[0].toFixed(decimalPlace)} - {maxVal} {measureUnit})
      </>
    );
  };

  return (
    <div className="tw-mt-2 tw-mb-8">
      <label className="form-label tw-mb-0" htmlFor={id}>
        {label} {renderValues()}
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Range
          values={values}
          step={step || STEP}
          min={min || MIN}
          max={max || MAX}
          rtl={rtl}
          onChange={(values) => setValues(values)}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: "5px",
                  width: "100%",
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#EA4747", "#ccc"],
                    min: min || MIN,
                    max: max || MAX,
                    rtl,
                  }),
                  alignSelf: "center",
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ index, props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "20px",
                width: "20px",
                borderRadius: "50%",
                backgroundColor: "#FFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 2px 6px #AAA",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "25px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  width: "10px",
                  height: "10px",
                  transform: "rotate(45deg)",
                }}
                className="tw-bg-primary"
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: "28px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "#548BF4",
                }}
                className="tw-bg-primary tw-w-fit tw-whitespace-nowrap"
              >
                {`${values[index].toFixed(decimalPlace)} ${measureUnit}`}
              </div>
              <div
                style={{
                  height: "16px",
                  width: "5px",
                  backgroundColor: isDragged ? "#EA4747" : "#CCC",
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default CustomDualSlider;
