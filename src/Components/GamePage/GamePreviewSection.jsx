import React from "react";
import { Timer, Hand, Trophy } from "lucide-react";

const GamePreviewSection = () => {
  return (
    <div className="flex justify-center px-6 py-16 font-fredoka bg-white">
      <div
        id="gamePreviewWrapper"
        className="max-w-5xl flex flex-col justify-center items-center text-center"
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          The Tap Game Challenge
        </h1>
        <h2 className="text-[16px] text-[#75758A] font-inter max-w-2xl leading-normal">
        Join the Tap Challenge by minting Royale NFT. Score big, earn rewards, and make your mark on the leaderboard.
        </h2>

        {/* Stats Grid */}
        <div
          id="stats-grid"
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full"
        >
          {/* Card 1 - Timer */}
          <div className=" bg-[#F6F6F8] border border-[#DDDDE6] p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition">
            <Timer className="w-8 h-8 text-[#7c42f0] mb-2" />
            <p className="text-lg font-semibold text-gray-700">30 seconds</p>
            <span className="text-sm text-gray-500">Fast-paced gameplay</span>
          </div>

          {/* Card 2 - Taps */}
          <div className=" bg-[#F6F6F8] border border-[#DDDDE6] p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition">
            <Hand className="w-8 h-8 text-[#6676f2] mb-2" />
            <p className="text-lg font-semibold text-gray-700">Tap to Score</p>
            <span className="text-sm text-gray-500">Every tap counts</span>
          </div>

          {/* Card 3 - Trophy */}
          <div className=" bg-[#F6F6F8] border border-[#DDDDE6] p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition">
            <Trophy className="w-8 h-8 text-[#7c42f0] mb-2" />
            <p className="text-lg font-semibold text-gray-700">Evolve & Win</p>
            <span className="text-sm text-gray-500">Progress through stages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePreviewSection;
