import React from "react";
import socket from "../socketConfig";
import { Link } from "react-router-dom";

const LeaveGame = ({ player, gameID }) => {
  // the whole point of this start button is
  // we only want this button to be visible if
  // the player is the party leader
  // in other words, did this player create the
  // game?

  const onClickHandler = (e) => {
    // now we want to emit the event to the server
    socket.emit("leave-game", { playerID: player._id, gameID });

    // the idea of having this flag here is I only
    // want the party leader to be able to click
    // this button once once he clicks it it emits
    // an this event and then hides this button
    // from this user
  };
  return (
    // now we are gonna check to see if we
    // should render this button or not
    // if both isPartyLeader && showBtn are
    // true, then we will render out this
    // button
    <Link to="/game/hall">
      <button
        type="button"
        onClick={onClickHandler}
        className="btn btn-primary">
        Leave the Game
      </button>
    </Link>
  );
};

export default LeaveGame;
