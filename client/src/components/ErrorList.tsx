import React from "react";

function ErrorList({ errors }) {
  console.log(errors);
  if (!errors || !errors.length) {
    return;
  }

  return (
    <div className="tw-w-full tw-p-3 tw-bg-errorBackground tw-border-error tw-border-2 tw-rounded-md tw-border-solid tw-text-red">
      <h5>Ooops...</h5>
      <ul>
        {errors.map((err) => {
          return <li>{err.message}</li>;
        })}
      </ul>
    </div>
  );
}

export default ErrorList;
