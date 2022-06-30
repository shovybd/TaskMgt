//context api
import React, { createContext } from "react";
import useAuthentication from "../Hooks/useAuthentication";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const allContexts = useAuthentication();
  return (
    <AuthContext.Provider value={allContexts}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
