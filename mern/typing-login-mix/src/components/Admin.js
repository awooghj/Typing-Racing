// this is more or less just a filler component, so this component
// is just gonna display it is an admin page

import React, { useState, useEffect, useReducer } from "react";
import AuthService from "../services/AuthService";
import UserItem from "./UserItem";
// reducer

export const ACTIONS = {
  LOAD_USERS: "load-users",
  PREMIUM_USER: "upgrade-user", // premium-user
  DELETE_USER: "delete-user",
  NORMAL_USER: "degrade-user",
};
function reducer(users, action) {
  switch (action.type) {
    case ACTIONS.LOAD_USERS:
      return users.concat(action.payload.usersInData);
    case ACTIONS.PREMIUM_USER:
      return users.map((user) => {
        if (user.username === action.payload.username) {
          return { ...user, role: (user.role = "admin") };
        }
        return user;
      });

    case ACTIONS.DEGRADE_USER:
      return users.map((user) => {
        if (user.username === action.payload.username) {
          return { ...user, role: (user.role = "user") };
        }
        return user;
      });

    case ACTIONS.DELETE_USER:
      return users.filter((user) => user.username !== action.payload.username);

    default:
      return users;
  }
}

//reducer

export default function Admin() {
  // const [users, setUsers] = useState([]);
  // reducer
  var [users, dispatch] = useReducer(reducer, []);
  // const [username, setName] = useState("");

  // reducer
  useEffect(() => {
    AuthService.getUsers().then((data) => {
      console.log(data.toString());

      dispatch({ type: ACTIONS.LOAD_USERS, payload: { usersInData: data } });
    });
  }, []);

  return (
    <table className="table  my-3">
      <thead>
        <tr>
          {/* # sign is the place the user got in */}
          <th scope="col">Username</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      {/* trying...*/}

      <tbody>
        {users.map((user) => {
          console.log(user);
          // dispatch is reducer
          return <UserItem key={user._id} user={user} dispatch={dispatch} />;
          // dispatch is reducer
        })}
      </tbody>
    </table>
  );
}

//===================================================================
// original only has loading users but no delete or upgrade function

// import React, { useState, useEffect, useReducer } from "react";
// import AuthService from "../services/AuthService";
// import UserItem from "./UserItem";
// // reducer

// export const ACTIONS = {
//   // ADD_TODO: "add-todo",
//   PREMIUM_USER: "premium-user",
//   DELETE_USER: "delete-user",
// };
// function reducer(users, action) {
//   switch (action.type) {
//     // case ACTIONS.ADD_TODO:
//     //   return [...todos, newTodo(action.payload.name)];
//     case ACTIONS.PREMIUM_USER:
//       return users.map((user) => {
//         if (user.username === action.payload.username) {
//           return { ...user, role: (user.role = "admin") };
//         }
//         return user;
//       });

//     case ACTIONS.DELETE_USER:
//       return users.filter((user) => user.username !== action.payload.username);

//     default:
//       return users;
//   }
// }
// //reducer

// export default function Admin() {
//   const [users, setUsers] = useState([]);
//   // reducer
//   var [managableUsers, dispatch] = useReducer(reducer, []);
//   // const [username, setName] = useState("");

//   // reducer
//   // AuthService.getUsers().then((data) => {
//   //   //setUsers(data);
//   //   console.log(data);
//   //   managableUsers = data; // reducer
//   // });

//   useEffect(() => {
//     AuthService.getUsers().then((data) => {
//       setUsers(data);
//       console.log(data);
//     });
//   }, []);
//   return (
//     <table className="table  my-3">
//       <thead>
//         <tr>
//           {/* # sign is the place the user got in */}
//           <th scope="col">Username</th>
//           <th scope="col">Role</th>
//         </tr>
//       </thead>
//       <tbody>
//         {users.map((user) => {
//           console.log(user);
//           // dispatch is reducer
//           return <UserItem key={user._id} user={user} />;
//           // dispatch is reducer
//         })}
//       </tbody>
//     </table>
//   );
// }
