import Game from '../components/game';
import Leaderboard from '../components/leaderboard';
import { useRouter } from 'next/router';

export default function GamePage() {
  const router = useRouter();
  const user  = router.query;
  const username = user.validUsername;
  const userId = user.userId;
  return (
    <div className="flex">
      <div className="flex-1">
        <Game user={username} userId={userId} />
      </div>
      <div className="w-1/3 p-6"> {/* Adjust the width and padding as needed */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Welcome, {username}!</h2>
          {/* Other content can go here */}
        </div>
        <Leaderboard />
      </div>
    </div>
  );
};
