import axios from "axios";
import React from "react";
import { cache } from "react";

import FlatItem from "../../src/components/FlatItem";

const getFlats = cache(async (params: any) => {
  let res;
  try {
    res = await axios.get("http://localhost:4000/api/flats", { params });
  } catch (err) {
    console.log(err);
    return null;
  }
  return res.data.flats;
});

async function FlatsPage({ searchParams }) {
  let flats = await getFlats(searchParams);
  //   console.log(flats);

  return (
    <div>
      {flats.map((flat) => (
        <FlatItem flat={flat} />
      ))}
    </div>
  );
}

export default FlatsPage;
