import React from "react";
import { Wallet, Rocket, Trophy, Zap, Database } from "lucide-react";

const GuidePage = () => {
  const steps = [
    {
      id: 1,
      title: "1. Connect Your Wallet",
      desc: "Start by connecting your crypto wallet. This will be your identity in the Tap Tap world - all your scores, NFTs, and progress are tied to it.",
      icon: <Wallet size={40} className="text-[#7C42F0]" />,
    },
    {
      id: 2,
      title: "2. Mint Royale NFT",
      desc: "Mint Royale NFT, it represents your journey in the game. NFT evolves as you level up and reach higher tiers.",
      icon: <Rocket size={40} className="text-[#3494F4]" />,
    },
    {
      id: 3,
      title: "3. Start Playing the Tap Game",
      desc: "Click ‘Start Play’ to begin! You’ll get a 3-second countdown. Tap as fast as you can for 30 seconds to earn points. Every tap counts!",
      icon: <Zap size={40} className="text-[#7C42F0]" />,
    },
        {
      id: 4,
      title: "4. Save Score on Irys Network",
      desc: "After the game ends, click ‘Save Score on Irys Network’ to store your score permanently. It ensures transparency and prevents data loss.",
      icon: <Database size={40} className="text-[#6676F2]" />,
    },
  
 
  {
      id: 5,
      title: "5. Evolve Your NFT",
      desc: "Your NFT evolves when you reach score milestones 100, 200, and 300. Each evolution brings new visuals and recognition.",
      icon: <Trophy size={40} className="text-[#FACC15]" />,
    },

      {
  id: 6,
  title: "6. Earn Future Rewards",
  desc: "Players who evolve their NFT to Stage 3 will become eligible for exclusive prizes and future rewards.",
  icon: <Database size={40} className="text-[#6676F2]" />,
},

  ];

  return (
    <div
      id="guidePage"
      className="min-h-screen bg-[#f6f6f8] py-16 px-6 font-fredoka flex flex-col items-center"
    >
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[#7C42F0] to-[#3494F4]">
          How It Works
        </h1>
        <p className="text-gray-500 text-lg font-inter mt-3">
          Learn how Tap Tap works from connecting your wallet to saving your score on-chain.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full animate-fadeIn">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm font-inter leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* About Tap Game Section */}
      <div className="mt-20 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-[#7C42F0] mb-4">About the Tap Game</h2>
        <p className="text-gray-600 font-inter text-base leading-relaxed">
          Tap Tap is a fast-paced reflex game where every second counts. You have 30 seconds to
          tap as many times as possible. Your score determines your NFT evolution level and your
          position on the leaderboard. Each score you save is permanently stored on Irys Network,
          making your progress verifiable and transparent forever.
        </p>
      </div>

      {/* About Leaderboard Section */}
      <div className="mt-16 max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-[#7C42F0] mb-4">About the Leaderboard</h2>
        <p className="text-gray-600 font-inter text-base leading-relaxed">
          The leaderboard ranks players globally based on their <span className="font-semibold text-[#7C42F0]">total scores</span>.
          Each saved score on the Irys Network adds to your lifetime total, improving your rank.
          The leaderboard updates every <span className="font-semibold text-[#3494F4]">4 hours</span> to ensure fairness and data integrity.
          Top players earn recognition and showcase their NFT evolution levels - proving their
          dominance in the Tap Tap world.
        </p>
      </div>
    </div>
  );
};

export default GuidePage;
