// passport is our authentication middleware
const passport = require("passport");
// LocalStrategy is how we authenticating against, so we will use a usename and
// password against a database
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");

// what we are doing here is extracting the JWT token from the request and
// secretOrKey is gonna to be used to verigy that token is legitimate

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// this middleware is going to be used for authorization
// this is gonna to be used whenever we want to protect our resources
// for example, we want to protect our todo endpoint and I also have our admin panel
// at this point, you will use authorization to protect the endpoints that you are
// interested in protecting
passport.use(
  new JWTStrategy(
    {
      // we pass an option object

      // jwtFromRequest is gonna be a function called cookieExtractor
      jwtFromRequest: cookieExtractor,

      // the next is the key that you use to sign to token
      secretOrKey: "NoobCoder",

      // so first we know that we need to get authenticated
      // passport.use(new LocalStrategy((username, password, done) is goning
      // to be triggered when we try to authenticate when we sign in using
      // our username and password. once we are authenticated, what's gonna
      // happen is we are going to set a cookie on the client browser and
      // this cookie is gonna be the JWT token, so what the property, jwtFromRequest,
      // is saying is the custom function that we are providing to extract the
      // JWT token from the request basically

      // the property, secretOrKey, is going to be used to verify the token
      // is legitimate

      // and the second thing is we are gonna get back the a verified callback
      // remember when we went over on the JWT.io, what the payload is, is
      // basically data that we set within our JWT token
    },
    (payload, done) => {
      // next we need to check to see if the user exists
      // remember we have been taught that we usually have a claim called subject
      // that subject is going to be the primary key of that user, so now what I
      // could do is 'payload.sub'
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        // we check if the user is not null
        // if the user is not null, that means we can return the user
        // so if there is a user that goes by that ID, we pass in null for the
        // error object and we pass the user himself
        if (user) {
          return done(null, user);
        }
        // otherwise, we return false. there is no error but there is no user
        // that has that primary key
        else {
          return done(null, false);
        }

        // the reason for being that is because we have already been authenticated
        // down here in
        // 'passport.use(new LocalStrategy((username, password, done) => {...}'
        // so we don't need to check the password in case you were trying to
        // compare the two
        // so we already know that the user is authenticated, otherwise, how else
        // would he have this JWT token to begin with
      });
    }
  )
);

// this local strategy is gonna take a verified callback
// username is going to be from the client, and password is also gonna
// be from the client, and done is a function that's gonna get invoked
// once the we are done
// the LocalStrategy below is used to authentication by using username and password
// this is gonna only be userd for when we login basically
passport.use(
  new LocalStrategy(
    // {
    //   // in passport official document, http://www.passportjs.org/docs/username-password/
    //   // the website says: " If your site prefers to name these fields differently, options
    //   // are available to change the defaults." hence I add this object with
    //   // usernameField: "email"
    //   // then in postman, you type "email": "tesetrtig1211" to post to the
    //   // url: http://localhost:5000/user/login, don't type "username": "tesetrtig1211"
    //   // anymore. password keep the same, don't change
    //   usernameField: "email",
    //   passwordField: "passwd",
    // },

    // The large comment above works only for postman monitoring, but in reality website,
    // adding this property will block the login page which causes a 400 bad request, so
    // here I decide not to add this block

    (username, password, done) => {
      // so the first thing we need to do is if we are gonna authenticate
      // against the database, is that actually check to see if the user is exactly
      // existing
      // so we check the existence of the user by its username, we query the database
      // to see if the user exists
      // then the callback following {username} is either returning user, or an error
      User.findOne({ username }, (err, user) => {
        // something went wrong with database, ex: database does not exist
        if (err) {
          return done(err);
        }
        // no user exists, not an error but false
        if (!user) {
          return done(null, false);
        }

        // here means we login the account and find the user, then we check the password
        // correctness
        user.comparePassword(password, done);
      });
    }
  )
);
