import React from "react";

export default function TodoItem(props) {
  console.log(props.nickname);
  return (
    <tr>
      {/* this shows what place the player ended up in
                , since we already sort our scoreBoard in 
                descending order, we will just output index plus
                one */}
      <th scope="row">{props.todo.place}</th>
      <td>{props.todo.nickname}</td>
      <td>{props.todo.WPM}</td>
    </tr>
  );
}
