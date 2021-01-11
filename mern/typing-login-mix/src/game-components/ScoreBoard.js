import React, { useState } from "react";
import TodoService from "../services/TodoService";
import socket from "../socketConfig";

const getPlaceInMatch = (scoreBoard, player) => {
  var currentCheckingPlaceAmongPlayers = 0;
  var placeMyUserGet = 0;

  while (currentCheckingPlaceAmongPlayers < scoreBoard.length) {
    if (
      scoreBoard[currentCheckingPlaceAmongPlayers].nickName === player.nickName
    ) {
      placeMyUserGet = currentCheckingPlaceAmongPlayers;
      console.log("find the player");
      console.log(placeMyUserGet);
      break;
    }
    currentCheckingPlaceAmongPlayers += 1;
  }

  return (placeMyUserGet += 1);
};

const getScoreBoard = (players) => {
  // two things we need to do
  // one is I only want the player to be on the scoreboard
  // if he's finished typing or time has run out of the
  // game, so what I am gonna do is filter out the result
  // if that hasn't occured
  // remember, WPM = -1 means this user hasn't finished
  // typing the sentence yet
  const scoreBoard = players.filter((player) => player.WPM !== -1);

  // now the scoreBoard above contains all players that
  // have finished typing or time has run out

  // next thing is we want to sort our scoreBoard in
  // descending order so that the highest WPM on top,
  // lowest on the bottom
  // playerA.WPM > playerB.WPM ? -1 will put playerA ahead of playerB
  // playerB.WPM > playerA.WPM ? -1 will put playerB ahead of playerA
  // return 0 means their WPM's are equal
  return scoreBoard.sort((playerA, playerB) =>
    playerA.WPM > playerB.WPM ? -1 : playerB.WPM > playerA.WPM ? 1 : 0
  );
};

function ScoreBoard({ players, player }) {
  const [state, updateState] = useState(false);
  // we want to arrange our players in descending order
  // so the highest WPM on top, lowest on the bottom
  const scoreBoard = getScoreBoard(players);
  var placeMyPlayerGet = getPlaceInMatch(scoreBoard, player);
  const onclick = () => {
    updateState(true);
    let playerInMatch = {
      nickname: player.nickName,
      WPM: player.WPM,
      place: placeMyPlayerGet,
    };
    TodoService.postTodo(playerInMatch).then((data) => data);
  };

  // scoreBoard.length ==0 0 means no one has finished typing
  if (scoreBoard.length === 0) {
    return null;
  } else {
    // otherwise, we render out a stripe table
    return (
      <table className="table  my-3">
        <thead>
          <tr>
            {/* # sign is the place the user got in */}
            <th scope="col">#</th>
            <th scope="col">User</th>
            <th scope="col">WPM</th>
          </tr>
        </thead>
        <tbody>
          {scoreBoard.map((player, index) => {
            return (
              <tr>
                {/* this shows what place the player ended up in
                                    , since we already sort our scoreBoard in 
                                    descending order, we will just output index plus
                                    one */}
                <th scope="row">{index + 1}</th>
                <td>{player.nickName}</td>
                <td>{player.WPM}</td>
              </tr>
            );
          })}
        </tbody>
        <button type="button" onClick={onclick} disabled={state}>
          Save the Match
        </button>
      </table>
    );
  }
}

export default ScoreBoard;
