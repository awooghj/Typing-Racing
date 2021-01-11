import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import GameMenu from "../game-components/GameMenu";
import socket from "../socketConfig";
import CreateGame from "../game-components/CreateGame";
import JoinGame from "../game-components/JoinGame";
import TypeRacer from "../game-components/TypeRacer";

export default function Game() {
  const [gameState, setGameState] = useState({
    _id: "",
    isOpen: false,
    players: [],
    words: [],
  });
  useEffect(() => {
    // once updateGame is called, we will set it in setGameState()
    socket.on("updateGame", (game) => {
      console.log(game);
      setGameState(game);

      // the code below has one problem: whenever you are setting this
      // state, setGameState, this is an asynchronous event, so this is
      // not synchronous. So what I need to do before navigating to the
      // game page is I need to make sure that this game state has been
      // loaded. Thus, we are not gonna use history.push here, we use
      // useEffect again

      //history.push(`/game/${game._id}`)
    });

    // once our component unmount, we are goning to use this function and
    // all we gonna to is to remove all the listeners off our socket
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    // if statement means "hey, we successfully update the game and now
    // go to the game page"
    if (gameState._id !== "") {
      history.push(`/game/${gameState._id}`);
    }
  }, [gameState._id]);
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/game/hall" component={GameMenu} />
        <Route path="/game/create" component={CreateGame} />
        <Route path="/game/join" component={JoinGame} />

        <Route
          path="/game/:gameID"
          render={(props) => <TypeRacer {...props} gameState={gameState} />}
        />
      </Switch>
    </Router>
  );
}
