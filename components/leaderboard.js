import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighScores = () => {
  const [highScores, setHighScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [params, setParams] = useState({top10: true});

  const fetchHighScores = async (queryParams) => {
    try {
      const response = await axios.get('http://localhost:5000/api/highscores', {
        params: queryParams,
      });

      if (response.status === 200) {
        setHighScores(response.data);
      } else {
        console.error('Failed to fetch high scores data');
      }
    } catch (error) {
      console.error('Error fetching high scores data:', error);
    }
  };

  const filterScoresByUsername = (usernameSearchTerm) => {
    return highScores.filter((score) => {
      const searchTerm = usernameSearchTerm.toLowerCase();
      const username = score.username.toLowerCase();
      for (let i = 0; i < searchTerm.length; i++) {
        if (username[i] !== searchTerm[i]) {
          return false;
        }
      }
      return true;
    });
  };

  const displayedScores = filterScoresByUsername(searchTerm);

  useEffect(() => {
    fetchHighScores(params);

    const ws = new WebSocket('ws://localhost:5000');

    ws.addEventListener('open', () => {
      console.log('WebSocket connection opened');
    });

    ws.addEventListener('message', async (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'newHighScore') {
        await fetchHighScores(params);
      }
    });

    return () => {
      ws.close();
    };
  }, [params]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleTop10Click = () => {
    setParams({ top10: true });
  };

  const handleAllScoresClick = () => {
    setParams({ allScores: true });
  };

  const handleClearFiltersClick = () => {
    setSearchTerm('');
    setParams({ top10: true });
  };

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High Scores</h2>
      <div className="mb-4 flex items-center">
        <button
          onClick={handleClearFiltersClick}
          className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2 ${
            params.top10 || params.allScores ? '' : 'hidden'
          }`}
        >
          Clear Filters
        </button>
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-l w-full"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleTop10Click}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded ${
            params.top10 ? 'bg-blue-600' : ''
          }`}
        >
          Top 10 Scores
        </button>
        <button
          onClick={handleAllScoresClick}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded ${
            params.allScores ? 'bg-blue-600' : ''
          }`}
        >
          All Scores
        </button>
      </div>
      <div className="leaderboard-max-screen-overflow">
        <ul>
          {displayedScores.map((score, index) => (
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
    </div>
  );
};


export default HighScores;


