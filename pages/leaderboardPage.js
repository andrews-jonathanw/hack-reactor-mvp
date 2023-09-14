import React from 'react';
import Leaderboard from '../components/leaderboard';
import { useUser } from '../components/UserContext';
import toast, { Toaster } from 'react-hot-toast';
const LeaderboardPage = () => {
  const { userInfo, isLoading } = useUser();

  const viewingAsGuest = () => {
    toast('You are viewing as a guest.', { icon: '👤' });
  };

  return (
      <div className="container mx-auto p-4">
        <Toaster />
        <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
        <Leaderboard userInfo={userInfo} viewingAsGuest={viewingAsGuest}/>
      </div>
  );
};

export default LeaderboardPage;
