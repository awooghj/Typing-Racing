// // all this file is gonna do is to fetch request through our endpoint
// // that we create in previous files

// // fetch use two then() because
// // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// // "Here we are fetching a JSON file across the network and printing it to
// // the console. The simplest use of fetch() takes one argument — the path
// // to the resource you want to fetch — and returns a promise containing the
// // response (a Response object). This is just an HTTP response, not the actual
// // JSON. To extract the JSON body content from the response, we use the json()
// // method (defined on the Body mixin, which is implemented by both the Request
// // and Response objects.)"

// const login = (user) => {
//   console.log(user);
//   return fetch("/user/login", {
//     method: "post",
//     body: JSON.stringify(user),
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   }).then((res) => {
//     if (res.status !== 401) return res.json().then((data) => data);
//     else return { isAuthenticated: false, user: { username: "", role: "" } };
//   });
// };

// const register = (user) => {
//   console.log(user);
//   return fetch("/user/register", {
//     method: "post",
//     body: JSON.stringify(user),
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => data);
// };
// const logout = () => {
//   return fetch("/user/logout")
//     .then((res) => res.json())
//     .then((data) => data);
// };

// const isAuthenticated = () => {
//   return fetch("/user/authenticated").then((res) => {
//     // res.status !== 401 means that this is a response that we wrote for ourselves
//     // passport automatically sends a 401 status if we are not authenticated if we
//     // use passport middleware, so we are gonna write the response client side
//     // so if it's not 401 status code, that means we have already written our own
//     // custom response here
//     if (res.status !== 401) {
//       return res.json().then((data) => data);
//     } else {
//       // if you get 401 code, that means you are unauthorized
//       return { isAuthenticated: false, user: { username: "", role: "" } };
//     }
//   });
// };

// const AuthServices = {
//   login,
//   register,
//   logout,
//   isAuthenticated,
// };

// update the user's role from user to admin
const degradeUser = (id) => {
  // findOneAndDelete({ _id: id })
  // this is a get request because by default it's already a get request
  return fetch(`/user/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    // since passport automatically sends a 401 unathorized if you are not
    // authenticated already, so in order to combat this, what we are gonna
    //  do is write our won response client side.
    if (response.status !== 401) {
      // but if it isn't a 401 request, that
      // means we already wrote a response on the server side
      return response.json().then((data) => data);
    } else return { message: { msgBody: "UnAuthorized", msgError: true } };
  });
};

// update the user's role from user to admin
const upgradeUser = (id) => {
  // findOneAndDelete({ _id: id })
  // this is a get request because by default it's already a get request
  return fetch(`/user/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    // since passport automatically sends a 401 unathorized if you are not
    // authenticated already, so in order to combat this, what we are gonna
    //  do is write our won response client side.
    if (response.status !== 401) {
      // but if it isn't a 401 request, that
      // means we already wrote a response on the server side
      return response.json().then((data) => data);
    } else return { message: { msgBody: "UnAuthorized", msgError: true } };
  });
};

// UserItem new feature
const deleteUser = (id) => {
  // findOneAndDelete({ _id: id })
  // this is a get request because by default it's already a get request
  return fetch(`/user/${id}`, {
    method: "delete",
  }).then((response) => {
    // since passport automatically sends a 401 unathorized if you are not
    // authenticated already, so in order to combat this, what we are gonna
    //  do is write our won response client side.
    if (response.status !== 401) {
      // but if it isn't a 401 request, that
      // means we already wrote a response on the server side
      return response.json().then((data) => data);
    } else return { message: { msgBody: "UnAuthorized", msgError: true } };
  });
};

// UserItem new feature------------------------------------

// export default AuthServices;
// admin new feature
const getUsers = () => {
  // this is a get request because by default it's already a get request
  return fetch("/user/users").then((response) => {
    // since passport automatically sends a 401 unathorized if you are not
    // authenticated already, so in order to combat this, what we are gonna
    //  do is write our won response client side.
    if (response.status !== 401) {
      // but if it isn't a 401 request, that
      // means we already wrote a response on the server side
      return response.json().then((data) => data);
    } else return { message: { msgBody: "UnAuthorized", msgError: true } };
  });
};
// admin new feature

const login = (user) => {
  console.log(user);
  return fetch("/user/login", {
    method: "post",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => {
    if (res.status !== 401) return res.json().then((data) => data);
    else return { isAuthenticated: false, user: { username: "", role: "" } };
  });
};

const register = (user) => {
  console.log(user);
  return fetch("/user/register", {
    method: "post",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
};
const logout = () => {
  return fetch("/user/logout")
    .then((res) => res.json())
    .then((data) => data);
};

const isAuthenticated = () => {
  return fetch("/user/authenticated").then((res) => {
    // res.status !== 401 means that this is a response that we wrote for ourselves
    // passport automatically sends a 401 status if we are not authenticated if we
    // use passport middleware, so we are gonna write the response client side
    // so if it's not 401 status code, that means we have already written our own
    // custom response here
    if (res.status !== 401) {
      return res.json().then((data) => data);
    } else {
      // if you get 401 code, that means you are unauthorized
      return { isAuthenticated: false, user: { username: "", role: "" } };
    }
  });
};

const AuthService = {
  login,
  register,
  logout,
  isAuthenticated,
  getUsers,
  deleteUser, // delte testing
  upgradeUser, // upgrade role testing
  degradeUser, // grade role testing
};

export default AuthService;
