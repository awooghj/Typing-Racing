import React from "react";
import { ACTIONS } from "./Admin";
import AuthService from "../services/AuthService";

export default function UserItem(props) {
  return (
    <tr>
      {/* this shows what place the player ended up in
                , since we already sort our scoreBoard in
                descending order, we will just output index plus
                one */}
      <th scope="row">{props.user.username}</th>
      {/* style={{ color: props.user.role === "admin" ? "#f5c756" : "#000" } */}
      <td
        style={{
          color: props.user.role === "admin" ? "#f5c756" : "#000",
        }}>
        {props.user.role}
      </td>

      {/* reducer */}

      <td>
        <button
          onClick={() => {
            if (props.user.role !== "admin") {
              props.dispatch({
                type: ACTIONS.DELETE_USER,
                payload: { username: props.user.username },
              });

              AuthService.deleteUser(props.user._id);
            }
          }}>
          Delete
        </button>
      </td>
      <td>
        <button
          onClick={() => {
            if (props.user.role !== "admin") {
              props.dispatch({
                type: ACTIONS.PREMIUM_USER,
                payload: { username: props.user.username },
              });

              AuthService.upgradeUser(props.user._id);
            } else {
              props.dispatch({
                type: ACTIONS.DEGRADE_USER,
                payload: { username: props.user.username },
              });

              AuthService.degradeUser(props.user._id);
            }
          }}>
          Role Upgrade
        </button>
      </td>

      {/* reducer */}
    </tr>
  );
}

// // original only has loading users but no delete or upgrade function
// export default function UserItem(props) {
//   console.log(props.users.toString());
//   console.log("all logout because of using props");
//   return (
//     <tr>
//       {/* this shows what place the player ended up in
//                 , since we already sort our scoreBoard in
//                 descending order, we will just output index plus
//                 one */}
//       <th scope="row">{props.user.username}</th>
//       {/* style={{ color: props.user.role === "admin" ? "#f5c756" : "#000" } */}
//       <td
//         style={{
//           color: props.user.role === "admin" ? "#f5c756" : "#000",
//         }}>
//         {props.user.role}
//       </td>
//     </tr>
//   );
// }
