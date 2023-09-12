import React from 'react';

const GAME_URL = "/index.html";

const GameContainer = ({ user, userId }) => {
  console.log(user)
  const gameUrlWithUserData = `${GAME_URL}?userId=${userId}`;

  return (
    <div>
      <iframe
      src={gameUrlWithUserData}
      className="iframe"
      title="Space Wars"
      frameBorder="0"
      width="800"
      height="600"
      allowFullScreen
      ></iframe>
    </div>
  );
};

export default GameContainer;





