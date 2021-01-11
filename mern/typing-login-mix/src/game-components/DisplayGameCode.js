import React, { useRef, useState } from "react";

const DisplayGameCode = ({ gameID }) => {
  // if the user successfully copy the game code, below this is gonna keep
  // track of
  const [copySuccess, setCopySuccess] = useState(false);

  const textInputRef = useRef(null);

  const copyToClipboard = (e) => {
    // here we select the input field, so that's why we attach the ref
    textInputRef.current.select();
    // document.execCommand("copy") will copy whatever value is within <input>
    // we set value= {gameID}, which is what user uses to actually join games
    document.execCommand("copy");
    // afterwards, once we copy the game room id, all we need to do is to
    // set our copy success to true
    setCopySuccess(true);
  };

  return (
    <div className="row my-3 text-center">
      <div className="col-sm"></div>
      <div className="col-sm-8">
        <h4>Send This Code to Your Friends for Them to Join</h4>
        <div className="input-group mb-3">
          {/* we have ref so we have an access to this input field,
                  once we have access to this input field, what we are gonna 
                  end up doing is copying the value which is the gameID into
                  the clipboard
                  That way, the user can essentially send this code to whoever
                  he wants to send it to */}
          <input
            type="text"
            ref={textInputRef}
            value={gameID}
            readOnly={true}
            className="form-control"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={copyToClipboard}
              type="button">
              {" "}
              Copy Gamecode
            </button>
          </div>
        </div>
        {copySuccess ? (
          <div className="alert alert-success" role="alert">
            Successfully Copied the Gamecode
          </div>
        ) : null}
      </div>
      <div className="col-sm"></div>
    </div>
  );
};

export default DisplayGameCode;
