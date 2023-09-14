import React, { useState, useEffect } from 'react';

const CursorGif = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleButtonClick = (e) => {
      if (e.target.tagName.toLowerCase() === 'button') {
        const x = e.clientX;
        const y = e.clientY;

        setPosition({ x, y });
        setIsVisible(true);

        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <video
        src="./media/giraffe-licks.mp4"
        alt="Cursor GIF"
        width="200"
        loop
        autoPlay
        style={{
          display: 'block',
          position: 'absolute',
          left: `${position.x - 50}px`,
          top: `${position.y - 50}px`,
          zIndex: 9999,
        }}
        />
      )}
    </>
  );
};

export default CursorGif;






