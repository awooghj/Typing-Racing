import React, { useState } from "react";
import socket from "../socketConfig";

const StartBtn = ({ player, gameID }) => {
  // the whole point of this start button is
  // we only want this button to be visible if
  // the player is the party leader
  // in other words, did this player create the
  // game?

  const [showBtn, setShowBtn] = useState(true);
  const { isPartyLeader } = player;

  const onClickHandler = (e) => {
    // now we want to emit the event to the server
    socket.emit("timer", { playerID: player._id, gameID });

    // the idea of having this flag here is I only
    // want the party leader to be able to click
    // this button once once he clicks it it emits
    // an this event and then hides this button
    // from this user
    setShowBtn(false);
  };
  return (
    // now we are gonna check to see if we
    // should render this button or not
    // if both isPartyLeader && showBtn are
    // true, then we will render out this
    // button
    isPartyLeader && showBtn ? (
      <button
        type="button"
        onClick={onClickHandler}
        className="btn btn-primary">
        Start Game
      </button>
    ) : // otherwise, we render null
    null
  );
};

export default StartBtn;
