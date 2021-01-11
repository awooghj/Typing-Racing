import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";
import AuthService from "../services/AuthService";

const Login = (props) => {
  const [user, setUser] = useState({ username: "", password: "" });

  // useState(null) is to signify not to render this message component
  const [message, setMessage] = useState(null);
  const authContext = useContext(AuthContext);

  const onChange = (e) => {
    // here we update the user to what the user is typing in. so we copy the user properties,
    // ...user, within our user object and next we will change the field which is targeted
    // e.target.name can be either username or password field and then e.target.value is setting
    // the actual value that the user is typing in
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    AuthService.login(user).then((data) => {
      console.log(data);
      const { isAuthenticated, user, message } = data;
      if (isAuthenticated) {
        // here we need to update our global context of the user since it's authenticated
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        // once we have done  authContext.setUser(user); and
        //authContext.setIsAuthenticated(isAuthenticated);, we want to navigate to the todos page,
        // inorder to do this, the history object below is gonna be from our react router, so that's
        // where we are getting it from. the history object has 'push' function, which is where you
        // want to go, so it will take us to the todos page
        // tutorial to 'history' object: https://reactrouter.com/web/api/history
        props.history.push("/todos");
      } else {
        // the system return an error message telling what is wrong
        setMessage(message);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please sign in</h3>
        {/* we can't use 'for' word since those are reserved */}
        {/* The for attribute is called htmlFor for consistency with the DOM property API */}
        <label htmlFor="username" className="sr-only">
          Username:
        </label>
        <input
          type="text"
          name="username"
          onChange={onChange}
          className="form-control"
          placeholder="Enter username"
        />

        <label htmlFor="password" className="sr-only">
          Password:
        </label>
        <input
          type="password"
          name="password"
          onChange={onChange}
          className="form-control"
          placeholder="Enter username"
        />

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Log in
        </button>
      </form>

      {/* we have a message component underneath the form in case we have a message to 
    display 
    code below means if message is not null, we will render the message component and
    we pass message as prop. otherwise, we don't render anything*/}

      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Login;
