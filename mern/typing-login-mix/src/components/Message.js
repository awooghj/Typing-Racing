// import React from "react";

// const getStyle = (props) => {
//   let baseClass = "alert";
//   if (props.message.msgError) {
//     // props.message.msgError means we want to display our message in a certain way
//     baseClass = baseClass + "alert-danger"; // this gonna output a red bootstrap well
//   } else {
//     // if it's not an error, you want to display like
//     baseClass = baseClass + "alert-primary";
//   }
//   return baseClass + " text-center";

//   // these are all bootstrap classes
// };

// export default function Message(props) {
//   return (
//     // we want to generate error messages in one way and non-error messages in another way
//     // so we create function 'getStyle' to help us get there
//     <div className={getStyle(props)} role="alert">
//       {/* within this div, we actually are gonna output the state message from our login
//         component, so remember we are passing that down as a prop
//          */}
//       {props.message.msgBody}
//     </div>
//   );
// }

import React from "react";

const getStyle = (props) => {
  let baseClass = "alert ";

  // props.message.msgError means we want to display our message in a certain way
  if (props.message.msgError) baseClass = baseClass + "alert-danger";
  // if it's not an error, you want to display like
  else baseClass = baseClass + "alert-primary";
  return baseClass + " text-center";

  // these are all bootstrap classes
};

const Message = (props) => {
  return (
    // we want to generate error messages in one way and non-error messages in another way
    // so we create function 'getStyle' to help us get there
    <div className={getStyle(props)} role="alert">
      {/* within this div, we actually are gonna output the state message from our login
         component, so remember we are passing that down as a prop */}
      {props.message.msgBody}
    </div>
  );
};

export default Message;
