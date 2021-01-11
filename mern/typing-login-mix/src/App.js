import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Todos from "./components/Todos";
import Admin from "./components/Admin";
import Game from "./components/Game";
// import UnPrivateRoute from "./hocs/UnPrivateRoute";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
import { useEffect } from "react";

// react-router is a routing system for react, so you have a main 'Router' and a
// 'Route' component . the 'Route' component takes in a path and based on that path
// it's gonna render components that you want to be rendered out
import { BrowserRouter as Router, Route } from "react-router-dom";

// App component here is gonna contain our whole application, so our application is
// gonna to end up having access to the users and authenticated states that we want
function App() {
  useEffect(() => {
    (async () => {
      const data = await fetch(
        "http//localhost:5000/user/authenticated"
      ).then((res) => res.json());
    })();
  });

  return (
    <Router>
      <Navbar />

      {/* component={Home} is the component we want to render */}
      {/* path="/" is the URL is gonna matched up with component={Home}, and
      component={Home} render the Home component when you hit "/" route*/}
      {/* the 'exact' property is because the react router uses partial pattern
      matching. so if I create another route and have "/something...", it will
      actually render out both routes. we don't want that to happen */}
      <Route exact path="/" component={Home} />
      <UnPrivateRoute path="/login" component={Login} />
      <UnPrivateRoute path="/register" component={Register} />
      <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} />
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
      <PrivateRoute
        path="/game/hall"
        roles={["user", "admin"]}
        component={Game}
      />
    </Router>
  );
}

export default App;
