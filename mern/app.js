const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const Game = require("./game-model/Game");
const QuotableAPI = require("./QuotableAPI");

const app = express();
const expressServer = app.listen(5000, () => {
  console.log("express server started");
});
const io = socketio(expressServer);

//this is the part of body parser we want to use, and this is
// because the client is gonna to be sending JSON to the server
// so we're gonna need to be able to parse that
app.use(express.json());
app.use(cookieParser());

// the reason why we use seNewUrlParser:true is because if you
// don't use it, the system will give you a deprecation warning
mongoose.connect(
  "mongodb://localhost:27017/mernauth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("successfully connect to database");
  }
);

// whenever there is a connection happening, this is gonna fire off
// this function and we should get back the socket
// it's an event-driven programming, so I give it something to listen
// for, so once I connect from a client this is gonna get invoke
io.on("connect", (socket) => {
  socket.on("userInput", async ({ userInput, gameID }) => {
    try {
      let game = await Game.findById(gameID);

      // we need to check if the game has actually
      // started
      // game.isOpen is false means the game has
      // started, so we listen for user input
      // game.isOver is false means the game
      // isn't over, so we still need to listen
      // for user input
      // once the game is over, we don't want to
      // check what the user is typing out
      if (!game.isOpen && !game.isOver) {
        // the first thing we need to do is to get
        // the player that actually made this request
        let player = game.players.find(
          (player) => player.socketID === socket.id
        );

        // then get the current word the user has
        // to type out
        // we could check the words array since we
        // have the current index the player is on
        let word = game.words[player.currentWordIndex];
        if (word === userInput) {
          // if word is equal to userInput, that means
          // the user has typed the word correctly
          // what we are gonna do is advance the user
          // to the next word
          player.currentWordIndex++;

          //next we need to check to see if users finish
          // typing out everything
          // if layer.currentWordIndex !== game.words.length
          // is true, that means they haven't finished typing
          // out
          if (player.currentWordIndex !== game.words.length) {
            // then we save the game
            game = await game.save();
            io.to(gameID).emit("updateGame", game);
          } else {
            // here means the player has officially
            // saved the game
            // what we need to do is to get the
            // timestamp of when he finished typing
            // out the words
            let endTime = new Date().getTime();

            // afterwards, let's go ahead and pull out
            // start time for our game object
            let { startTime } = game;

            player.WPM = calculateWPM(endTime, startTime, player);

            game = await game.save();
            socket.emit("done");
            socket.emit("gameIsOver");
            io.to(gameID).emit("updateGame", game);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("timer", async ({ gameID, playerID }) => {
    // the countdown can be set any number as you want
    let CountDown = 2;
    let game = await Game.findById(gameID);

    // we need the actual player who made this request
    // we need to make sure this player is the party
    // leader. the function 'id(playerID)' will return
    // the player who made the request
    let player = game.players.id(playerID);

    // if the player is the leader, we will start the
    // countdown
    if (player.isPartyLeader) {
      let timerID = setInterval(async () => {
        // so first we want to check to see whether
        // or not our countdown should end
        if (CountDown >= 0) {
          io.to(gameID).emit("timer", { CountDown, msg: "Starting Game" });
          CountDown--;
        } else {
          // this means the game has started and
          // no one can join the game right now
          game.isOpen = false;
          game = await game.save();

          // once we save the game, we want to
          // emit to our clients that "hey, the
          // game has updated"
          io.to(gameID).emit("updateGame", game);

          startGameClock(gameID);

          clearInterval(timerID);
        }
      }, 1000);
    }
  });

  // we destructure the object in the async function
  socket.on("join-game", async ({ gameID: _id, nickName }) => {
    try {
      // the first thing we need to do is to get our game
      // we use mongoose method: findById
      let game = await Game.findById(_id);

      // next we test the seat of the game is open
      // if it's open, that means we are allowed to join,
      // if it's close, that means the game is either over
      // or already started
      if (game.isOpen) {
        // we want to make the socket to join the game so we
        // get the primary key as we get from the code below
        const gameID = game._id.toString();
        socket.join(gameID);

        // next we create the player
        let player = {
          socketID: socket.id,
          nickName,
        };

        // afterwards we add the player to the game
        game.players.push(player);

        // then save the game
        game = await game.save();

        // then we need to let these sockets know this player
        // has joined the game. so we need to tell the io
        // server to emit his event for us
        io.to(gameID).emit("updateGame", game);
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("create-game", async (nickName) => {
    //within try, let us use quotable API so that we are gonna
    // get the sentence that we want our player to type out
    try {
      // quotableData gives us the words that the players
      // need to type out

      const quotableData = await QuotableAPI();
      let game = new Game();
      // set the game.words to the data that we fetch
      game.words = quotableData;

      let player = {
        socketID: socket.id,

        // since this player is the one who create this game
        isPartyLeader: true,
        nickName,
      };

      // we add this host player to players, afterwards,
      // we save the game
      game.players.push(player);
      game = await game.save();

      // we need to create a room for all our sockets within
      // our game, in order to do that, we use the primary key
      // from our game object

      // this gives the primary key, but we need it in string format
      // not an object, so call toString method
      const gameID = game._id.toString();

      // then we make our socket to join that game in order to do that,
      // we call socket.join and pass in the game id
      socket.join(gameID);

      // then we need to tell our io server to send this to every socket
      // within this room
      // this gonna say "hey, I need you to look this room, this game
      // id which should be unique and I want you to admit this event,
      // updateGame, and just pass in the game
      io.to(gameID).emit("updateGame", game);
    } catch (err) {
      console.log(err);
    }
  });
});

const startGameClock = async (gameID) => {
  let game = await Game.findById(gameID);

  // getTime() return the number of milliseconds since 1970/01/01:
  game.startTime = new Date().getTime();
  game = await game.save();

  // here we differentiate from our timer. timer only had
  // seconds, but now we would have minutes and seconds
  let time = 5; // 2 minutes

  // setInterval does not execute immediately, so there's
  // going to be a noticeable delay. thus what we do is to
  // immediately execute this function and then I am going
  // to return it
  let timerID = setInterval(
    (function gameIntervalFunc() {
      // format the time
      // I want to display time = 120 seconds to minutes
      // and seconds. that's what the function 'calculateTime'
      // will do
      const formatTime = calculateTime(time);

      // this if statement will keep doing until time reaches 0
      if (time >= 0) {
        io.to(gameID).emit("timer", {
          CountDown: formatTime,
          msg: "Time remaining",
        });
        time--;
      } else {
        // afterwards, if the time is 0, it means the game
        // is over and we need to get the timestamp
        // since 'setInterval' is not a async function
        // we are gonna declare a anonymous async
        // function and goning to immediately execute it

        (async () => {
          let endTime = new Date().getTime();
          let game = await Game.findById(gameID);
          // let {startTime} = game
          let startTime = game.startTime;
          game.isOver = true;

          // if the players haven't finished within alloted
          // time, that means we haven't calculated the WPM
          // so what we are gonna do is to iterate throughout
          // all our players and check to see if their WPM
          // calculated or not
          game.players.forEach((player, index) => {
            // WPM === -1 means we haven't calculated yet
            // if it's true, we will calculate WPM for them
            if (player.WPM === -1) {
              game.players[index].WPM = calculateWPM(
                endTime,
                startTime,
                player
              );
            }
          });

          game = await game.save();
          io.to(gameID).emit("updateGame", game);
          clearInterval(timerID);
        })();
      }

      return gameIntervalFunc;
    })(),
    1000
  );
};

const calculateTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  // what ${seconds < 10 ? "0" + seconds : seconds} did is
  // if second part less than 10 seconds, we add a 0 in
  // front of remaining second, otherwise, leave it as what
  // the current second is
  // ex: 1:9 should be 1:09, 1:15 is still 1:15
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const calculateWPM = (endTime, startTime, player) => {
  let numOfWords = player.currentWordIndex;
  const timeInSeconds = (endTime - startTime) / 1000;
  const timeInMinutes = timeInSeconds / 60;
  const WPM = Math.floor(numOfWords / timeInMinutes);
  return WPM;
};

const userRouter = require("./routes/User");
const { Server } = require("http");
app.use("/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("typing-login-mix/build"));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "typing-login-mix", "build", "index.html")
    );
  });
}

// // we listen to port 5000 since the defalut react listens to 3000
// app.listen(5000, () => {
//   console.log("express server started");
// });
