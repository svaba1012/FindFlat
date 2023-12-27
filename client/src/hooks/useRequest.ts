import React, { useState } from "react";
import axios from "axios";

export const useRequest = (url: string, method: string) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (body: any) => {
    try {
      setErrors(null);
      let res = await axios[method](url, body, {
        withCredentials: true,
      });
      return res;
    } catch (err) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
  };

  return { doRequest, errors };
};
