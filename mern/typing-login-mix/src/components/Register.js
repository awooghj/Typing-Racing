import React, { useState, useEffect, useRef } from "react";
import Message from "../components/Message";
import AuthService from "../services/AuthService";

const Register = (props) => {
  const [user, setUser] = useState({ username: "", password: "", role: "" });

  // useState(null) is to signify not to render this message component
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setUser({ username: "", password: "", role: "" });
  };

  let timerID = useRef(null);
  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

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
    AuthService.register(user).then((data) => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerID = setTimeout(() => {
          props.history.push("/login");
        }, 2000);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please register</h3>
        {/* we can't use 'for' word since those are reserved */}
        {/* The for attribute is called htmlFor for consistency with the DOM property API */}
        <label htmlFor="username" className="sr-only">
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={user.username}
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
          value={user.password}
          onChange={onChange}
          className="form-control"
          placeholder="Enter username"
        />
        <label htmlFor="role" className="sr-only">
          Role:
        </label>
        <input
          type="text"
          name="role"
          value={user.role}
          onChange={onChange}
          className="form-control"
          placeholder="Enter role (admin/user)"
        />

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Register
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

export default Register;
