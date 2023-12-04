"use client";
import React, { useState } from "react";

const RootContext = React.createContext(null);

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  let [currentUser, setCurrentUser] = useState({ verified: true });
  let [flats, setFlats] = useState([]);
  return (
    <RootContext.Provider
      value={{ currentUser, setCurrentUser, flats, setFlats }}
    >
      {children}
    </RootContext.Provider>
  );
};

export { RootContext, RootProvider };
