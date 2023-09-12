import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);

  // Fetch initial high scores data
  const fetchHighScores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/highscores');
      if (response.status === 200) {
        setHighScores(response.data);
      } else {
        console.error('Failed to fetch high scores data');
      }
    } catch (error) {
      console.error('Error fetching high scores data:', error);
    }
  };

  useEffect(() => {
    // Fetch initial high scores
    fetchHighScores();

    // Connect to the WebSocket server
    const ws = new WebSocket('ws://localhost:5000');

    // Event listener for opening the connection
    ws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
    });

    // Event listener for receiving messages from the server
    ws.addEventListener('message', async (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'newHighScore') {
        // Re-fetch high scores to update the leaderboard
        await fetchHighScores();
      }
    });

    // Cleanup WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High Scores</h2>
      <ul>
        {highScores.map((score, index) => (
          <li
            key={index}
            className={`flex justify-between items-center py-2 ${
              index % 2 === 0 ? 'bg-gray-200' : ''
            }`}
          >
            <span className="font-bold">{capitalizeFirstLetter(score.username)}</span>
            <span className="text-gray-600">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScores;
