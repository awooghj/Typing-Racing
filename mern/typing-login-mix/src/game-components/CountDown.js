import React, { useState, useEffect } from "react";
import socket from "../socketConfig";

const CountDown = (props) => {
  const [timer, setTimer] = useState({ CountDown: "", msg: "" });

  useEffect(() => {
    // listen to the 'timer' event
    socket.on("timer", (data) => {
      // set the timer to the data
      // and the timer is always used to display the
      // time to the user
      // this is gonna invoke a lot
      setTimer(data);
    });

    // listen to the 'done' event
    // this is only gonna invoked only when the user
    // types out everything
    // when the game clock is going , if the players
    // finish early, we are gonna listen for this
    // 'done' event and we will remove the listener
    // for the timer
    // so that's gonna stop the timer from updating
    socket.on("done", () => {
      // this is just the user can see how much time
      // he complete the sentence, by removing the
      // listener, our time stops updating

      socket.removeListener("timer");
    });
  }, []);

  const { CountDown, msg } = timer;
  return (
    <>
      <h1>{CountDown}</h1>
      <h3>{msg}</h3>
    </>
  );
};

export default CountDown;
