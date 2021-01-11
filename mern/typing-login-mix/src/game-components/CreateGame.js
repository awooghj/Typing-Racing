import React, { useState } from "react";
import socket from "../socketConfig";
import { Link } from "react-router-dom";

const CreateGame = (props) => {
  const [nickName, setNickName] = useState("");

  const onChange = (e) => {
    // set the nickname to whatever the target is
    // so that's gonna update each time someone
    // types within our input field

    setNickName(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // so here we emit create-game and now we need
    // to go back to server side and listen for the
    // event
    socket.emit("create-game", nickName);
  };

  return (
    <div className="row">
      <div className="col-sm"></div>

      <div className="col-sm-8">
        <h1 className="text-center">Create Game</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nickname">Enter Nickname</label>
            <input
              type="text"
              name="nickname"
              value={nickName}
              onChange={onChange}
              placeholder="Enter nickname"
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <Link to="/game/hall">
          <button type="submit" className="btn btn-primary">
            Back
          </button>
        </Link>
      </div>

      <div className="col-sm"></div>

      {/* <Link to="/">
        <button type="button" className="btn btn-primary btn-lg">
          Leave Game
        </button>
      </Link> */}
    </div>
  );
};

export default CreateGame;
