import React, { useState } from "react";
import socket from "../socketConfig";
import { Link } from "react";
const JoinGame = (props) => {
  const [userInput, setUserInput] = useState({ gameID: "", nickName: "" });

  const onChange = (e) => {
    // we are gonna use spread operator to copy over the existing
    // property within our state
    // and next what we are gonna do is change the current property
    // that the user is typing in

    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(userInput);
    // so here we emit create-game and now we need
    // to go back to server side and listen for the
    // event
    socket.emit("join-game", userInput);
  };

  return (
    <div className="row">
      <div className="col-sm"></div>

      <div className="col-sm-8">
        <h1 className="text-center">Join Game</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="gameID">Enter Game ID</label>
            <input
              type="text"
              name="gameID"
              value={userInput.gameID}
              onChange={onChange}
              placeholder="Enter Game ID"
              className="form-control"
            />

            <label htmlFor="nickName">Enter Nickname</label>
            <input
              type="text"
              name="nickName"
              value={userInput.nickName}
              onChange={onChange}
              placeholder="Enter nickname"
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>

      <div className="col-sm"></div>

      <Link to="/game/hall">
        <button type="button" className="btn btn-primary">
          Back
        </button>
      </Link>
    </div>
  );
};

export default JoinGame;
