import React from 'react';
import Leaderboard from '../components/leaderboard';

const LeaderboardPage = () => {
  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <Leaderboard />
      </div>
  );
};

export default LeaderboardPage;
