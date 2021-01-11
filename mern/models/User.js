const mongoose = require("mongoose");

// we use bcrypt to hash password, in other words, we encrypt it
// the reason is if your database ever gets compromised, a jeacker
// is not gonna have access to the passwords of everyone within
// your database because the password is gonna be encrypted
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,

    // required : true means you must have a username for this user
    required: true,

    //username length we want it >= 6, <= 15
    min: 6,
    max: 15,
  },
  password: {
    type: String,
    required: true,
  },

  // role, is this player an admin, moderator, normal user, ... etc
  role: {
    type: String,
    // we want predetermined roles, so I don't want the user to
    // give us any roles they want
    enum: ["user", "admin"],
    required: true,
  },

  // todos is gonna contain an array of todos
  // what todos contain an array of objectID of the todo and of course,
  // the object ID is the primary key of that todo
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

// now we want to do is to define the mongoose pre-hook
// this code below is gonna execute right before we save
// the reason for that is because we must hash the password
// before we save it to the database

// we use old function(){} instead of arrow function since
// we want to access to 'this', if you use arrow function
// with 'this', the error occurs
UserSchema.pre("save", function (next) {
  // basically this function is mongoose version of
  // middleware, so it's gonna work exaclt the same
  // once you are done, you should execute the next
  // function to symbolize that you could go on to
  // the next save

  // now we are checking to see whether or not we
  // need to hash
  if (!this.isModified("password")) {
    return next();
  }
  // what the block of code is doing above is it's
  // checking to see if our password field within
  // our document has been modified already
  // if it's been modified, that means there's no
  // need to hash the password, so we only need to
  // hash the password if it is a plain text

  // so two test cases will be the user just created
  // his account and in that case the password is not
  // hashed
  // or let's say for example, the user wants to change
  // his password to a new password. that means the
  // password isn't hashed yet and we need to hash it

  // so if it passes the check point,
  // 'if (!this.isModified("password"))',
  // that means we need to hash the password
  // so,
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    // if no error returns, it means our password
    // is successfully hashed
    // now what we need to do is to override our
    // existing password and set it to the password
    // hashed
    this.password = passwordHash;
    // then we call next() to symbolie we're done
    next();
  });
  // about he bcrypt.hash, check the website
  // https://medium.com/@manishsundriyal/a-quick-way-for-hashing-passwords-using-bcrypt-with-nodejs-8464f9785b67
});

// the reason we need a comparePassword function is because
// we need a way to the plain text version of the password
// that we receive from the client to the hashed version
// within our database
// luckily, Bcrypt has a function that we can use
UserSchema.methods.comparePassword = function (password, callback) {
  // the first argument is the password from the client,
  // let's say he tries to sign in
  // the seond argument is gonna be the hashed password
  // so we call this.password
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    } else {
      // the if statement below is executed if the
      // password that they gave us doesn't match
      // the password within out datebase
      if (!isMatch) {
        return callback(null, isMatch);
      }

      // otherwise, return 'this', the user
      // this ends up attaching the user object
      // to the request object
      return callback(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
