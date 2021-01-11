import React, { useState, createContext } from "react";

export const UserContext = createContext();
export const UserProvider = (props) => {
  const [user, setUser] = useState({ props });
};
