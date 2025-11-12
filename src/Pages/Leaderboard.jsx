import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  // const [players, setPlayers] = useState([]);
  // const [loading, setLoading] = useState(true);

  // // Simulate fetching leaderboard data
  // useEffect(() => {
  //   setTimeout(() => {
  //     const fetchedPlayers = [
  //       {
  //         id: 1,
  //         username: "DataPunk",
  //         wallet: "0x23...9A1C",
  //         totalScore: 14500,
  //         gamesPlayed: 52,
  //         timeSpent: 128,
  //         highestScore: 410,
  //         nft: "https://ipfs.io/ipfs/QmExample1", // Replace with NFT image URL
  //         tier: "Mythic",
  //       },
  //       {
  //         id: 2,
  //         username: "",
  //         wallet: "0x82...7BCF",
  //         totalScore: 12000,
  //         gamesPlayed: 45,
  //         timeSpent: 102,
  //         highestScore: 392,
  //         nft: "https://ipfs.io/ipfs/QmExample2",
  //         tier: "Legendary",
  //       },
  //       {
  //         id: 3,
  //         username: "IrysWarrior",
  //         wallet: "0x65...ABCD",
  //         totalScore: 9900,
  //         gamesPlayed: 41,
  //         timeSpent: 90,
  //         highestScore: 360,
  //         nft: "https://ipfs.io/ipfs/QmExample3",
  //         tier: "Epic",
  //       },
  //       {
  //         id: 4,
  //         username: "AlphaTapper",
  //         wallet: "0x56...A92E",
  //         totalScore: 7800,
  //         gamesPlayed: 30,
  //         timeSpent: 75,
  //         highestScore: 340,
  //         nft: "https://ipfs.io/ipfs/QmExample4",
  //         tier: "Rare",
  //       },
  //       {
  //         id: 5,
  //         username: "",
  //         wallet: "0x92...F1B3",
  //         totalScore: 6200,
  //         gamesPlayed: 28,
  //         timeSpent: 64,
  //         highestScore: 312,
  //         nft: "https://ipfs.io/ipfs/QmExample5",
  //         tier: "Uncommon",
  //       },
  //     ];
  //     setPlayers(fetchedPlayers);
  //     setLoading(false);
  //   }, 2000); // simulate 2s delay
  // }, []);

  // return (
  //   <div className="min-h-screen bg-[#f6f6f8] py-12 px-6 flex justify-center">
  //     <div className="max-w-6xl w-full font-fredoka">
  //       <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
  //         Leaderboard 🏆
  //       </h1>

  //       {loading ? (
  //         <div className="flex justify-center items-center h-64">
  //           <div className="w-12 h-12 border-4 border-[#7C42F0] border-t-transparent rounded-full animate-spin"></div>
  //         </div>
  //       ) : (
  //         <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden">
  //           <table className="w-full text-left">
  //             <thead className="bg-[#7C42F0] text-white">
  //               <tr>
  //                 <th className="py-4 px-6 text-sm font-semibold">Rank</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Player</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">NFT</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Tier</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Total Score</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Games Played</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Time Spent (min)</th>
  //                 <th className="py-4 px-6 text-sm font-semibold">Highest Score (30s)</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {players.map((player, index) => (
  //                 <tr
  //                   key={player.id}
  //                   className={`border-b border-gray-200 ${
  //                     index < 5 ? "bg-[#f3ecff]" : "bg-white"
  //                   } hover:bg-[#ece4ff] transition-all`}
  //                 >
  //                   <td className="py-4 px-6 text-gray-800 font-semibold">
  //                     #{index + 1}
  //                   </td>
  //                   <td className="py-4 px-6 font-medium text-gray-700">
  //                     {player.username || player.wallet}
  //                   </td>
  //                   <td className="py-4 px-6">
  //                     <img
  //                       src={player.nft}
  //                       alt="nft"
  //                       className="w-12 h-12 rounded-xl border border-gray-200 object-cover"
  //                     />
  //                   </td>
  //                   <td className="py-4 px-6">
  //                     <span
  //                       className={`px-3 py-1 rounded-full text-xs font-semibold ${
  //                         player.tier === "Mythic"
  //                           ? "bg-linear-to-r from-yellow-400 to-red-500 text-white"
  //                           : player.tier === "Legendary"
  //                           ? "bg-purple-500 text-white"
  //                           : player.tier === "Epic"
  //                           ? "bg-blue-500 text-white"
  //                           : player.tier === "Rare"
  //                           ? "bg-green-500 text-white"
  //                           : "bg-gray-400 text-white"
  //                       }`}
  //                     >
  //                       {player.tier}
  //                     </span>
  //                   </td>
  //                   <td className="py-4 px-6 text-gray-800">{player.totalScore}</td>
  //                   <td className="py-4 px-6 text-gray-800">{player.gamesPlayed}</td>
  //                   <td className="py-4 px-6 text-gray-800">{player.timeSpent}</td>
  //                   <td className="py-4 px-6 text-gray-800">{player.highestScore}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}

  //       <p className="text-gray-500 text-sm font-inter mt-6 text-center">
  //         Rankings update automatically every 4 hours.
  //       </p>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-[#f6f6f8] flex flex-col justify-center items-center px-6 py-12">
     
      <p className="text-gray-600 text-lg text-center max-w-lg">
        Leaderboard is coming soon! 
        <br />
        Stay tuned to see global player rankings, NFTs, tiers, and scores.
      </p>
     
    </div>
  );

};

export default Leaderboard;
