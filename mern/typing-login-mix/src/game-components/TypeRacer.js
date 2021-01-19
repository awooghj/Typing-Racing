import React from "react";
import { Redirect, Link } from "react-router-dom";
import CountDown from "./CountDown";
import StartBtn from "./StartBtn";
import socket from "../socketConfig";
import DisplayWords from "./DisplayWords";
import Form from "./Form";
import ProgressBar from "./ProgressBar";
import ScoreBoard from "./ScoreBoard";
import DisplayGameCode from "./DisplayGameCode";
// import { Link } from "react-router-dom";

// webRTC----------------
import VideoChat from "./VideoChat";
// webRTC----------------

const findPlayer = (players) => {
  // this is gonna return the player that matches the socket id
  // that means that this is us
  return players.find((player) => player.socketID === socket.id);
};

const TypeRacer = ({ gameState }) => {
  // We pull out isOpen, isOver from gameState to let
  // Form use both of them
  const { _id, players, words, isOpen, isOver } = gameState;

  // players contains all the players within the game. I want
  // the actual player, that's us, that's playing the game. I
  // don't want all my opponents, I want myself
  const player = findPlayer(players);

  // if the _id is equal to empty string, that means that this
  // user on this page did not go to the join page. then we need
  // to redirect them to the home page
  if (_id === "") {
    return <Redirect to="/" />;
  }

  return (
    <div className="text-center">
      <DisplayWords words={words} player={player} />
      <ProgressBar
        players={players}
        player={player}
        wordsLength={words.length}
      />

      {/* We have Form here and as props. what we are gonna
            take in is isOpen, isOver, and gameID */}
      <Form isOpen={isOpen} isOver={isOver} gameID={_id} />

      <CountDown />
      <StartBtn player={player} gameID={_id} />
      <DisplayGameCode gameID={_id} />
      <ScoreBoard players={players} player={player} />
      <VideoChat />

      <Link to="/game/create">
        <button type="button" className="btn btn-primary">
          Back
        </button>
      </Link>

      {/* <Link to="/game">
        <button type="button" className="btn btn-primary btn-lg">
          Leave Game
        </button>
      </Link> */}
    </div>
  );
};

export default TypeRacer;
