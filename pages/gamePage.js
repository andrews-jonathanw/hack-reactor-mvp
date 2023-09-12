import Game from '../components/game';
import Leaderboard from '../components/leaderboard';
export default function GamePage() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Game />
      </div>
      <div className="w-1/3"> {/* Adjust the width as needed */}
        <Leaderboard />
      </div>
    </div>
  );
};
