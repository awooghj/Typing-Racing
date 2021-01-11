import React from "react";

// calculatePercentage will calculate what percent the user has typed out
const calculatePercentage = (player, wordsLength) => {
  if (player.currentWordIndex !== 0) {
    // we return (player.currentWordIndex / wordsLength) * 100,
    // which is the amount of words the user has typed out
    return ((player.currentWordIndex / wordsLength) * 100).toFixed(2) + "%";
  }
  return 0; // if the user hasn't typed out anything
};

const ProgressBar = ({ player, players, wordsLength }) => {
  const percentage = calculatePercentage(player, wordsLength);
  return (
    <div>
      {
        <>
          {/* We always want our user to be on top of all progress bar */}
          <h5 class="mt-5 nav nav-pills pull-left">{player.nickName}</h5>
          {/* we use "my-1" to give some space in Y margin */}
          <div className="progress my-1" key={player._id}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: percentage }}>
              {percentage}
            </div>
          </div>
        </>
      }
      {/* we also want to draw out the other players
      , we don't just want our player, so we map over
      players array */}
      {players.map((playerObj) => {
        const percentage = calculatePercentage(playerObj, wordsLength);

        // since we already ouputted our player, so we
        // don't want to output it twice
        // so for our mapping, we want to check to see
        // we should render that player or not

        // playerObj._id !== player._id means I want
        // you to render this because this player
        // hasn't been rendered yet

        return playerObj._id !== player._id ? (
          <>
            {/* We always want our user to be on top of all progress bar */}
            <h5 class="mt-3 nav nav-pills pull-left">{playerObj.nickName}</h5>
            {/* we use "my-1" to give some space in Y margin */}
            <div className="progress my-1" key={playerObj._id}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: percentage }}>
                {percentage}
              </div>
            </div>
          </>
        ) : null;
      })}
    </div>
  );
};

export default ProgressBar;
