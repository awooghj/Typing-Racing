import React, { useContext } from "react";
import { Link, BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";

export default function Navbar(props) {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(
    AuthContext
  );

  const onClickLogoutHandler = () => {
    AuthService.logout().then((data) => {
      // what happening in if statement is, when we log out we reset the user
      // so the username is gonna be empty string and row is gonna be empty
      // string and then we are just setting it to false
      // the success of data.success is whether or not we successfully log
      // out or not
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  const unauthenticatedNavBar = () => {
    return (
      <>
        {/* here is gonna be made up of list components. remember, we removed all li
        elements within our unordered list(ul), so we will just re-add them back within
        // here  */}

        {/* it's a home link */}
        <Link to="/">
          <li className="nav-item nav-link">Home</li>
        </Link>

        {/* it's a login link */}
        <Link to="/login">
          <li className="nav-item nav-link">Login</li>
        </Link>

        {/* it's a register link */}
        <Link to="/register">
          <li className="nav-item nav-link">Register</li>
        </Link>
      </>
    );
  };

  const authenticatedNavBar = () => {
    return (
      <>
        {/* it's a home link */}
        <Link to="/">
          <li className="nav-item nav-link">Home</li>
        </Link>

        {/* it's a todos link */}
        <Link to="/todos">
          <li className="nav-item nav-link">Matches</li>
        </Link>

        {/* since there two roles for a user to be, so if you are an admin you see
        admin page, otherwise, you see null */}
        {user.role === "admin" ? (
          <Link to="/users">
            <li className="nav-item nav-link">Admin</li>
          </Link>
        ) : null}

        {/* it's a logout button */}
        <Link to="/">
          <button
            type="button"
            className="btn btn-link nav-item nav-link"
            onClick={onClickLogoutHandler}>
            Logout
          </button>
        </Link>

        <BrowserRouter forceRefresh={true}>
          <Link to="/game/hall">
            <li className="nav-item nav-link">Hall</li>
          </Link>
        </BrowserRouter>
      </>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {/* to="/" in Link takes us to the homepage */}
      <Link to="/">
        <div className="navbar-brand">Type Racing</div>
      </Link>
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* we want different links displayed dependt on whether or not you are
            logged in or not
            if you are logged in you see different link than if you are not logged in,
            for example*/}
            {/* if we are not authenticated, I want you to render out unauthenticatedNavBar
            otherwise, we render out the authenticated version of it, authenticatedNavBar

            isAuthenticated is gonna be pualled from our global context*/}
            {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
          </ul>
        </div>
      </div>
    </nav>
  );
}
