import React, { useEffect, useState, useRef } from "react";
import socket from "../socketConfig";

// what we pull out from props is everything we pass down
const Form = ({ isOpen, isOver, gameID }) => {
  const [userInput, setUserInput] = useState("");

  const textInput = useRef(null);

  useEffect(() => {
    // once we listen for isOpen changes, we are
    // gonna check to see if isOpen becomes false
    if (!isOpen) {
      // if isOpen is false, that means the game
      // has started
      // what we end up doing is telling our text
      // input to focus
      // what focus is gonna do is bring our cursor
      // to the textbox
      textInput.current.focus();
    }

    // within our dependency array we are gonna check
    // to see if isOpen changes
  }, [isOpen]);

  const resetForm = () => {
    // all our resetForm do is to set our
    // user input to empty string
    setUserInput("");
  };

  const onChange = (e) => {
    // first thing we need to do is to get the
    // value within the textbox
    let value = e.target.value;

    // next we want to get the last character

    // the reason why we want to get the last
    // character is because I am efectively
    // listening for when the user hits the
    // space bar. the user hits the spacebar
    // that means he's submitting this word
    // for the server to check

    // in order to get the last character
    // doing so will give us the last
    // character that the user typed out
    let lastChar = value.charAt(value.length - 1);

    // then next we are gonna do is to check
    // to see if the user hits the spacebar
    if (lastChar === " ") {
      // if the user hits the spacebar
      // we send this to the server
      // the idea is you want the server
      // to check if the client types the
      // word right
      // you never want the client to check
      // the word by himself
      socket.emit("userInput", { userInput, gameID });
      resetForm();
    } else {
      // if the user doesn't hit the
      // spacebar, we will set our user
      // input to whatever the value is
      setUserInput(e.target.value);
    }
  };

  return (
    // here we cover what we are gonna render out, so
    // we are gonna return basically just a form
    // so first we are gonna wrap it with a div
    <div className="row my-3">
      {/* we want some space on Y margin
              and then we create grid*/}
      <div className="col-sm"></div>

      <div className="col-sm-4">
        <form>
          <div className="form-group">
            {/* we only want readOnly set the true
                        if isOpen is true or isOver is true 
                        the reason why I want our input readOnly 
                        is because I don't want user typing anything
                        within the text box when the game hasn't
                        even started. so {isOpen || isOver} is 
                        checking to see if the game is open that 
                        means the game hasn't started yet. I am 
                        checking isOver because I don't want the user
                        typing anything once the game ends, that 
                        doesn't make sense either */}
            <input
              type="text"
              readOnly={isOpen || isOver}
              onChange={onChange}
              value={userInput}
              className="form-control"
              // ref  is what we are gonna
              // to be rendering out to the
              // user
              ref={textInput}
            />
          </div>
        </form>
      </div>

      <div className="col-sm"></div>
    </div>
  );
};

// so by default, we set our textInput to readOnly cause the game hasn't started
// yet, once the game starts, which is why we are listening for isOpen. isOpen
// becomes false, then I want you to focus on the textbox. that's gonna put our
// cursor within the textbox so the user can immediately typing our the sentences

export default Form;
