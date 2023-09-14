import Game from '../components/game';
import Leaderboard from '../components/leaderboard';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, isLoading } from '../components/UserContext';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function GamePage() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const { userInfo, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!userInfo) {
        router.push('/?signIn=true');
      }
    }
  }, [userInfo, isLoading, router]);

  useEffect(() => {
    if (router.query.validUsername && router.query.userId) {
      setUsername(router.query.validUsername);
      setUserId(router.query.userId);
    }
  }, [router.query]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (userInfo === null) {
    return <div>Loading Page</div>;
  }

  // Conditionally render the Game component based on userInfo.id
  return userInfo.id ? (
    <div className="flex m-auto justify-center items-stretch h-full">
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg p-4">
          <Game user={username} userId={userInfo.id} />
        </div>
      </div>
      <div className="w-1/3 p-4">
        <div className="h-full bg-gray-100 rounded-lg p-4">
          {console.log(userInfo)}
          <h2 className="text-xl font-semibold mb-2 text-left mt-2 ml-2">
            Welcome, {capitalizeFirstLetter(userInfo.username)}!
          </h2>
          <Leaderboard userInfo={userInfo} />
        </div>
      </div>
    </div>
  ) : null; // Render null if userInfo.id is not available yet
}



