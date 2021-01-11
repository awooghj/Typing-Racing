// this higher order component is to protect the components that you need to
// be logged in for

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// we are destructure the props that is passed in
// the first thing to do is to pull out the 'component' and we will name it to
// 'Component' with capital C. the reason for that is because it's actually
// required by react that components need to be capitalized. ex: PrivateRoute
// second thing is to pull out 'roles'. what role is, is the roles that you want
// to be access this particular route
// the reset parameter, ... rest, is to collect all the properties that you are not
// pulling out from 'component' and 'role', and I want to store these left properties
// in ...rest

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return (
    <Route
      // {...rest} is a spread operator, so it's gonna copy the properties within
      // this object, ...rest, into this new object, {...rest}, here
      {...rest}
      // render={()=>{...}} is goning to decide what to render
      render={(props) => {
        // if the user is not authenticated, we will redirect him to the page '/login'
        // pathname: "/login" is where the user will be sent to if he is not authenticated
        // state: { from: props.location } is where the user is coming from
        if (!isAuthenticated)
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );

        // here we want to check to see if the user has correct role. we get an array of
        // roles from 'roles' by destructuring the passed in prop. what this 'role' is
        // containing is all the roles that you want to have the access to this component
        // so below we want to check to see if the user's role is not included within
        // 'roles' array
        // if 'roles.includes(user.role)' is false, that means the user doesn't have the
        // correct role in order to view this page
        if (!roles.includes(user.role))
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
