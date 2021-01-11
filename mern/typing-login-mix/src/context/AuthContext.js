import React, { createContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService";

// createContext gives us an AuthContext object and this gives us a provider
// in a consumer
// so a privider, anything that's wrapped in a provider is gonna have an
// access to the global state, but you also have to consume it
// so we just consume the global state

export const AuthContext = createContext();

// children in this case refers to the components that we want to wrap our
// provider around
// children will be the app components
const AuthProvider = ({ children }) => {
  // user is the user that is logged in
  const [user, setUser] = useState(null);
  // isAuthenticated is if this user is authenticated or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // isLoaded is used as a boolean value to see if the app is loaded because
  // we will make a request to the server
  const [isLoaded, setIsLoaded] = useState(false);

  // empty array or empty dependency means I only want this useEffect hook
  // to execute once
  // we will use it as a dev mount lifecycle
  useEffect(() => {
    AuthService.isAuthenticated().then((data) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoaded(true);
    });
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <h1>Loading</h1>
      ) : (
        // what we are doing here is wrapping the AuthContext provider, value object
        // contains states and functions we want to be global
        // we are wrapping providers around the app components, children
        <AuthContext.Provider
          // value props decide what we want to make available as a global state
          value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

export default AuthProvider;
