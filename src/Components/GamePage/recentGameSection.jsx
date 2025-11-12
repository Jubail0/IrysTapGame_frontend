import React from "react";
import { CheckCircle, Gamepad2 } from "lucide-react";
import { useGameStore } from "../../Store/useGameStore";
import { motion } from "framer-motion";

const RecentGameSection = () => {
  const { recentGames } = useGameStore();
  const gamesToShow = recentGames.slice(0, 9);

  const GameCard = ({ game }) => {
    const dateObj = new Date(game.savedAt);
    const formattedDate = dateObj.toUTCString().split(" ").slice(0, 4).join(" ");
    const formattedTime = dateObj.toUTCString().split(" ")[4];

    return (
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center min-w-[250px] mx-4 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all duration-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{game.username || game.wallet}</h3>
        <p className="text-2xl font-bold text-[#7c42f0] mb-2">Score: {game.score}</p>
        <p className="text-gray-500 text-sm font-inter mb-3">{formattedDate} • {formattedTime} UTC</p>
        <div className="flex items-center gap-2 mt-auto">
          <CheckCircle className="text-[#22c55e]" size={18} />
          <span className="text-green-600 text-sm font-medium">Saved on Irys</span>
        </div>
      </div>
    );
  };

  // Scroll animation
  const scrollAnimation = {
    x: ["0%", "-50%"], // move half width of duplicated content
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 15,
      ease: "linear",
    },
  };

  // Duplicate the cards twice for seamless loop
  const repeatedGames = [...gamesToShow, ...gamesToShow];
// e5e0ff
  return (
    <div className="py-12 px-6 bg-[#e5e0ff] w-full overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-800 mb-15 text-center font-fredoka">
        Recent Games Globally
      </h2>

      {gamesToShow.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 py-16">
          <Gamepad2 size={50} className="text-[#7c42f0] mb-3" />
          <p className="text-lg font-semibold">No recent games found</p>
          <p className="text-sm font-inter">Be the first one to play and to see your stats here!</p>
        </div>
      ) : (
        <motion.div
          className="flex w-max"
          animate={scrollAnimation}
        >
          {repeatedGames.map((game, idx) => (
            <GameCard key={`game-${idx}`} game={game} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RecentGameSection;
