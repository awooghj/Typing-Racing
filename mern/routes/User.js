const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const User = require("../models/User");
const Todo = require("../models/Todo");

// we use jsonwebtoken to sign our jwt token, so when yousign a jwt token, you are
// basically creating it for us
const JWT = require("jsonwebtoken");

// signToken takes in a primary key
const signToken = (userID) => {
  // JWT.sign() is gonna return the actual JWT token
  // we pass payload to sign() as first argument
  // the second argument is the key that you want to sign with, remember this key
  // here must match the key that you use in secretOrKey within you passport

  // so passport is gonna use the key in secretOrKey to verify that the token is
  // legitimate, thus they must match

  // third argument in sign() is the amount of time that you want the token be expired
  // 1h = 1 hour, 1 day = 1 day long...
  return JWT.sign(
    {
      // iss, or the issuer, who issue this jwt token
      iss: "NoobCoder",
      // sub, or the subject, who is this jwt token for
      sub: userID,

      // remember in payload, you can send back whatever you want but don't send
      // back sensitive data like creditcard information
    },
    "NoobCoder",
    { expiresIn: "1h" }
  );
};

// first we will make the register, so when a user wants a username, we have our
// register as our endpoint
userRouter.post("/register", (req, res) => {
  // we pull out the username and password and role from the request body

  const { username, password, role } = req.body;

  // then we query by the username, then we get a callback with error object and
  // user document if the user exists
  User.findOne({ username }, (err, user) => {
    // if there's an error, it means there's an error about searching this
    // username within our database
    if (err) {
      res
        .status(500)
        .json({ message: { msgBody: "Error has occured", msgError: true } });
    }

    // if there's a user, that means the username that the individaual is trying
    // to create already exists, so he can't have this username
    if (user) {
      res.status(400).json({
        message: { msgBody: "Username is already taken", msgError: true },
      });
    } else {
      // here means the user is successfully created, then we create a mongoose model
      const newUser = new User({ username, password, role });
      // we save user into the database
      newUser.save((err) => {
        if (err) {
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        } else {
          res.status(201).json({
            message: {
              msgBody: "Account successfully created",
              msgError: false,
            },
          });
        }
      });
    }
  });
});

// passport.authenticate('local', ) is the middleware and its first argument is the strategy
// that you want to use, {session: false} means the server is not maintaining the session
userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    //req,isAuthenticated() returns true if we are authenticated, otherwise, false
    if (req.isAuthenticated()) {
      // then we pull out the primary key, username and the role
      // req.user comes from passport file's user.comparePassword()
      // what passport is doing is attaching that user object to the request object
      const { _id, username, role } = req.user;
      const token = signToken(_id);

      // httpOnly is going to make it so that onthe client side, you can't touch
      // this cookie using javascript basically and that's going to prevent against
      // cross-site scripting attack
      // sameSite is to protect against a different attack. It prevent against cross-
      // siterequest forgery attacks
      // these two properties are important in terms of security and make sure that
      // your JWT token won't be stolen
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });

      // isAuthenticated: true because it successfully login
      // and we pass back user with username and user role
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // req.logout() usage in passport official document:
    // http://www.passportjs.org/docs/logout/
    req.logout();
    // this remove the token
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

userRouter.post(
  "/todo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // first we create the instance of todo
    // req.body is from client, whatever the client wants us to create
    const todo = new Todo(req.body);
    todo.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.todos.push(todo);

        // req.user is added by passport so passport actually attaches the
        // user to the request object, so this user is from our database
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Error has occured", msgError: true },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "Successfully created todo",
                msgError: false,
              },
            });
        });
      }
    });
  }
);

userRouter.get(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // when we find the user, the todo array is only gonna have
    // primary key within it, but I don't just want primary key,
    // I want actual data within that todo, so that's what
    // populate("todos") means
    // we use exec(()=>{}) to execute it
    User.findById({ _id: req.user._id })
      .populate("todos")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else {
          // so todos in the code below is all todos the user has, the authenticated
          // is for our front end, to let us know that we are still logged in
          res.status(200).json({ todos: document.todos, authenticated: true });
        }
      });
  }
);

userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // remeber passport.authenticate("jwt") is gonna an unauthorized request if
    // we don't have our jwt token
    // if we get authorized, we now need to check to see if the user has the right
    // permissions since it's an admin panel
    // if (req.user.role === "admin") is true means the user has the right to be
    // in this page
    if (req.user.role === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "You are an admin", msgError: false } });
    } else
      res.status(403).json({
        message: { msgBody: "You're not an admin,go away", msgError: true },
      });
  }
);

// this route is for persistence of the client
// since we are working with react, once we login, we save in the state we are
// logged in. but once you close the browser, the state gets reset, so what this
// endpoint does is to make sure our backend is synced in. ao even the user close
// the website, we will still be logged in if he is authenticated
userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  }
);

userRouter.post(
  "/game",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    //req,isAuthenticated() returns true if we are authenticated, otherwise, false
    if (req.isAuthenticated()) {
      // then we pull out the [rimary key, username and the role
      // req.user comes from passport file's user.comparePassword()
      // what passport is doing is attaching that user object to the request object
      const { _id, username, role } = req.user;
      const token = signToken(_id);

      // httpOnly is going to make it so that onthe client side, you can't touch
      // this cookie using javascript basically and that's going to prevent against
      // cross-site scripting attack
      // sameSite is to protect against a different attack. It prevent against cross-
      // siterequest forgery attacks
      // these two properties are important in terms of security and make sure that
      // your JWT token won't be stolen
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });

      // isAuthenticated: true because it successfully login
      // and we pass back user with username and user role
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  }
);
// admin and users, get all users from the database
userRouter.get("/users", async (req, res, next) => {
  // when we find the user, the todo array is only gonna have
  // primary key within it, but I don't just want primary key,
  // I want actual data within that todo, so that's what
  // populate("todos") means
  // we use exec(()=>{}) to execute it
  await User.find({})
    .then((users) => res.json(users))
    .catch((err) => next(err));
});

// delete user from database
userRouter.delete("/:id", async (req, res, next) => {
  await User.findByIdAndRemove(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
});

// update the user from user to admin
userRouter.put("/:id", async (req, res, next) => {
  // await User.findByIdAndRemove(req.params.id)
  //   .then(() => res.json({}))
  //   .catch((err) => next(err));

  const user = await User.findById(req.params.id);

  // validate
  if (!user) throw "User not found";
  if (user.role === "admin") {
    user.role = "user";
  } else if (user.role === "user") {
    user.role = "admin";
  }

  await user.save();
});

// update the user from user to admin

module.exports = userRouter;
