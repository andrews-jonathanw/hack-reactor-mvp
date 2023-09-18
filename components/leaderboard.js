import React, { useEffect, useState } from 'react';
import axios from 'axios';


const HighScores = ({userInfo, viewingAsGuest}) => {
  const [highScores, setHighScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTop10Pressed, setIsTop10Pressed] = useState(false);
  const [isAllScoresPressed, setIsAllScoresPressed] = useState(false);
  const [isUsernamePressed, setIsUsernamePressed] = useState(false);
  const [params, setParams] = useState({top10: true});

  const fetchHighScores = async (queryParams) => {
    try {
      const response = await axios.get('ec2-3-22-234-154.us-east-2.compute.amazonaws.com:5000/api/highscores', {
        params: queryParams,
      });

      if (response.status === 200) {
        console.log(response.data)
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
    setIsTop10Pressed(true);
    setIsAllScoresPressed(false);
    setParams({ top10: true });
  };

  const handleAllScoresClick = () => {
    setIsAllScoresPressed(true);
    setIsTop10Pressed(false);
    setParams({ allScores: true });
  };

  const handleUsernameFilterClick = async () => {
    if (userInfo !== null) {
      setIsTop10Pressed(false);
      setIsAllScoresPressed(false);
      setIsUsernamePressed(!isUsernamePressed);
      setParams({ userScores: true, username: userInfo.username });
    } else {
      handleClearFiltersClick();
      setIsTop10Pressed(true);
      setIsAllScoresPressed(false);
      viewingAsGuest();
    }

  };

  const handleClearFiltersClick = () => {
    setSearchTerm('');
    setParams({ top10: true });
  };

  return (
    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High Scores</h2>
      <div className="mb-4 flex items-center">
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
          onClick={() => {
            handleClearFiltersClick();
            setIsTop10Pressed(true);
            setIsAllScoresPressed(false);
          }}
          className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2 ${
            isTop10Pressed || isAllScoresPressed || isUsernamePressed ? 'bg-red-600 custom-shadow' : ''
          }`}
        >
          Clear Filters
        </button>

        <button
          onClick={() => {
            handleTop10Click();
            setIsAllScoresPressed(false); // Clear the other button's pressed state
          }}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded ${
            params.top10 || isTop10Pressed ? 'bg-blue-600 custom-shadow' : ''
          }`}
        >
          Top 10 Scores
          {params.top10 || isTop10Pressed ? <div className="text-xs">(Sorted by highest first)</div> : null}
        </button>

        <button
          onClick={() => {
            handleAllScoresClick();
            setIsTop10Pressed(false); // Clear the other button's pressed state
          }}
          className={`bg-blue-500 hover.bg-blue-600 text-white py-2 px-4 mr-2 rounded ${
            params.allScores || isAllScoresPressed ? 'bg-blue-600 custom-shadow' : ''
          }`}
        >
          All Scores
          {params.allScores || isAllScoresPressed ? <div className="text-xs">(Sorted by highest first)</div> : null}
        </button>
        <button
          onClick={handleUsernameFilterClick}
          className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ${
            isUsernamePressed ? 'bg-green-600 custom-shadow' : ''
          }`}
          >
            Your Scores
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


