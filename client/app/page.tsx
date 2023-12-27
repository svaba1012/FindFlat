import React from "react";

import FindFlatForm from "../src/forms/FindFlatForm";

function MainPage(props) {
  console.log("Glavna strana");
  console.log(process.env.NEXT_PUBLIC_SERVER_URL);
  return (
    <div>
      <h2 className="tw-pl-5">Find Flat</h2>
      <FindFlatForm />
    </div>
  );
}

export default MainPage;
