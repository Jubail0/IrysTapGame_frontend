import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const redirect_To_mint = () => {
    const gameSection = document.getElementById("mintNftSection");
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const redirect_To_Guide = () => {
    navigate("/how-it-works");
  };

  return (
    <section
      id="heroSection"
      className="bg-linear-to-r from-[#7c42f0] to-[#3494f4] text-center text-[#F6F6F8] py-24 px-6 flex justify-center items-center"
    >
      <div
        id="heroWrapper"
        className="max-w-3xl flex flex-col items-center gap-8 font-fredoka"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg">
          Tap Royale
        </h1>

        <h2 className="text-lg sm:text-xl text-[#E5E7EB] leading-relaxed max-w-2xl">
          Enter the arena where every tap counts. Mint your NFT, climb the ranks,
          and evolve with every victory.
        </h2>

        <div className="flex flex-wrap justify-center gap-5 mt-4">
          <button
            onClick={redirect_To_mint}
            className="bg-[#7C42F0] cursor-pointer hover:bg-[#6a38d4] text-[#F6F6F8] px-8 py-4 rounded-xl font-semibold transition-transform transform hover:scale-105 shadow-md"
          >
            Enter the Arena
          </button>

          <button
            onClick={redirect_To_Guide}
            className="bg-[#FCFCFD] hover:bg-[#eaeaea] text-[#22222A] px-8 py-4 rounded-xl font-semibold transition-transform transform hover:scale-105 shadow-md"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
