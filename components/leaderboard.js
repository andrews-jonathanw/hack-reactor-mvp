import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
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

    fetchHighScores();
  }, []);

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High Scores</h2>
      <ul>
      {console.log(highScores)}
        {highScores.map((score, index) => (
          <li
            key={index}
            className={`flex justify-between items-center py-2 ${
              index % 2 === 0 ? 'bg-gray-200' : ''
            }`}
          >
            <span className="font-bold">{score.username}</span>
            <span className="text-gray-600">{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScores;
