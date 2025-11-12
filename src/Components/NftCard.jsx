import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import api from "../api/axios";
import { Loader2 } from "lucide-react";

const NftCard = ({ user, nft, fetchUserNft, theme }) => {
  const [isEvolving, setIsEvolving] = useState(false);
  const [currentNft, setCurrentNft] = useState(nft);
  const [evolvedStage, setEvolvedStage] = useState(user?.nftStage ?? 1);

  const currentStage = evolvedStage;

  const handleEvolve = async () => {
    if (currentStage >= 4) return;

    try {
      setIsEvolving(true);

      const res = await api.post("/api/nft/evolve", {
        walletAddress: user.walletAddress,
      });

      if (!res.data?.success) {
        console.warn(res.data?.message || "Evolution failed");
        setIsEvolving(false);
        return;
      }

      const evolvedNft = res.data?.nft;
      const nextStage = evolvedNft?.stage ?? currentStage;

      await new Promise((resolve) => setTimeout(resolve, 800));

      setCurrentNft({
        name: evolvedNft?.name,
        description: evolvedNft?.description,
        image: evolvedNft?.image,
        attributes: evolvedNft?.attributes ?? [
          { trait_type: "Stage", value: nextStage },
        ],
      });

      setEvolvedStage(nextStage);
      await fetchUserNft(evolvedNft?.metadataUrl);
      setIsEvolving(false);
    } catch (error) {
      console.error("❌ Evolution failed:", error);
      setIsEvolving(false);
    }
  };

  const thresholds = import.meta.env.VITE_THRESHOLDS.split(",").map(Number);
  const canEvolve =
    user?.bestScore >= thresholds[currentStage - 1] && currentStage < 4;

  return (
    <div
      className="w-full max-w-4xl mt-12 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: "#fff" }}
    >
      <h2
        className="text-2xl font-bold mb-6 flex items-center justify-between transition-colors"
        style={{ color: theme.primary }}
      >
        Your NFT Status
        {user && currentStage < 4 ? (
          canEvolve && (
            <button
              disabled={isEvolving}
              onClick={handleEvolve}
              className={`text-white font-semibold px-5 py-2 rounded-lg transition flex items-center gap-2 shadow-md ${
                isEvolving ? "cursor-not-allowed opacity-80" : ""
              }`}
              style={{
                backgroundColor: theme.primary,
              }}
              onMouseEnter={(e) =>
                !isEvolving &&
                (e.currentTarget.style.backgroundColor = theme.primaryHover)
              }
              onMouseLeave={(e) =>
                !isEvolving &&
                (e.currentTarget.style.backgroundColor = theme.primary)
              }
            >
              {isEvolving ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Evolving...
                </>
              ) : (
                "Ready to Evolve 🔥"
              )}
            </button>
          )
        ) : (
          <p className="text-gray-600 font-medium mt-3">🪄 Max Stage Reached</p>
        )}
      </h2>

      {/* --- NFT DISPLAY --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 relative">
        <div className="w-full sm:w-1/2 flex justify-center relative">
          {/* 🔥 Fire Glow Animation */}
          <AnimatePresence>
            {isEvolving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full blur-2xl bg-linear-to-r from-purple-500 via-orange-400 to-amber-300 bg-clip-text text-transparent"
              />
            )}
          </AnimatePresence>

          {/* 🔥 Floating Fire Particles */}
          <AnimatePresence>
            {isEvolving &&
              Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-2 h-2 rounded-full opacity-80"
                  style={{ backgroundColor: theme.primary }}
                  initial={{
                    x: Math.random() * 200 - 100,
                    y: 200,
                    scale: 0.6,
                    opacity: 0.8,
                  }}
                  animate={{
                    y: -200 - Math.random() * 100,
                    x: Math.random() * 100 - 50,
                    opacity: [1, 0],
                    scale: [0.8, 0],
                  }}
                  transition={{
                    duration: 1.8 + Math.random(),
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: Math.random(),
                  }}
                />
              ))}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentNft?.image || evolvedStage}
              src={currentNft?.image}
              alt={`NFT Stage ${evolvedStage}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isEvolving ? [1, 1.2, 1] : 1,
                opacity: 1,
                filter: isEvolving
                  ? [
                      `drop-shadow(0 0 30px ${theme.primary})`,
                      `drop-shadow(0 0 60px ${theme.primaryHover})`,
                      `drop-shadow(0 0 30px ${theme.primary})`,
                    ]
                  : "drop-shadow(0 0 10px rgba(0,0,0,0.2))",
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-[400px] h-[400px] rounded-xl shadow-lg object-cover relative z-10"
            />
          </AnimatePresence>
        </div>

        {/* --- NFT DETAILS --- */}
        <div className="w-full sm:w-1/2 text-center sm:text-left">
          <p
            className="text-lg font-bold transition-colors"
            style={{ color: theme.primary }}
          >
            {currentNft?.name || `Stage ${evolvedStage} NFT`}
          </p>
          <p className="text-gray-600 mt-2 font-inter">
            {currentNft?.description || "Evolving NFT powered by Irys"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            {currentNft?.attributes?.map((attr, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm font-medium rounded-full border transition-colors"
                style={{
                  backgroundColor:
                    theme.primary === "#ff6a00" ? "#fff4e5" : "#f6f1ff",
                  color: theme.primary,
                  borderColor:
                    theme.primary === "#ff6a00" ? "#ffe2c2" : "#e4d2ff",
                }}
              >
                {attr.trait_type}: {attr.value}
              </span>
            ))}
          </div>

          {user?.nftMetadataUrl && (
            <div
              className="mt-6 p-4 rounded-xl text-sm text-gray-700 border transition-colors"
              style={{
                backgroundColor:
                  theme.primary === "#ff6a00" ? "#fff8f2" : "#f9f6ff",
                borderColor:
                  theme.primary === "#ff6a00" ? "#ffe2c2" : "#e2d4ff",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-medium transition-colors"
                  style={{ color: theme.primary }}
                >
                  Metadata URL
                </span>
                <a
                  href={user?.nftMetadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {user?.nftMetadataUrl.slice(0, 35)}...
                </a>
              </div>

              {user?.metadataTx && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-500">Verify on Explorer</span>
                  <a
                    href={`https://explorer.irys.xyz/tx/${user?.metadataTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Upload ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftCard;
