import React from 'react';

const GAME_URL = "/index.html";

const GameContainer = () => {
  return (
    <div>
      <iframe
      src={GAME_URL}
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





