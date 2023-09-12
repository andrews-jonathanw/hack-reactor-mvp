import Game from '../components/game';
import Leaderboard from '../components/leaderboard';
import { useRouter } from 'next/router';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function GamePage() {
  const router = useRouter();
  const user  = router.query;
  const username = user.validUsername;
  const userId = user.userId;

  return (
    <div className="flex m-auto justify-center items-stretch h-full">
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg p-4">
          <Game user={username} userId={userId} />
        </div>
      </div>
      <div className="w-1/3 p-4">
        <div className="h-full bg-gray-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2 text-left mt-2 ml-2">
            Welcome, {capitalizeFirstLetter(username)}!
          </h2>
          {/* Other content can go here */}
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
