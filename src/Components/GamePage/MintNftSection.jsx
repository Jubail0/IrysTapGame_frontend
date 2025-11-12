import React, { useEffect, useState } from "react";
import MintNftModal from "./MintModal";
import { useUserStore } from "../../Store/useUserStore";
import { useNFTStore } from "../../Store/useNftStore";
import { useAccount } from "wagmi";
import { notifyError } from "../../Utils/notify";
import { Loader2 } from "lucide-react"; // 👈 loader icon

const MintNftSection = () => {
  const { isConnected, address } = useAccount();
  const { user, refreshUserData } = useUserStore();
  const { fetchUserNft, nft } = useNFTStore();

  const [showMintModal, setShowMintModal] = useState(false);
  const [showNftImage, setShowNftImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(true);

  // ✅ Step 2: When user metadata URL is available, fetch NFT metadata
  useEffect(() => {
    if (user?.nftMetadataUrl) {
      fetchUserNft(user.nftMetadataUrl);
    }
  }, [user?.nftMetadataUrl]);

  // ✅ Step 3: Handle NFT image display & loader
  useEffect(() => {
    const nftPreviewImage =
      "https://uploader.irys.xyz/7VTcTZGZcEJ3u64rFHhr176rac2AMG9g8noEUgB6om73";

    setLoadingImage(true);
    const newImage = nft?.image ? nft.image : nftPreviewImage;

    const img = new Image();
    img.src = newImage;
    img.onload = () => {
      setShowNftImage(newImage);
      setLoadingImage(false);
    };
    img.onerror = () => {
      setShowNftImage(nftPreviewImage);
      setLoadingImage(false);
    };
  }, [nft, user]);

  // ✅ Step 4: Allow user to mint NFT
  const handleMintValidation = () => {
    if (!isConnected) {
      notifyError("Wallet connection required!");
      return;
    }
    setShowMintModal(true);
  };

  // ✅ Scroll to game section
  const redirect_To_gameplay = () => {
    const gameSection = document.getElementById("gameSectionInline");
    if (gameSection) gameSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="mintNftSection"
      className="px-6 py-20 flex justify-center bg-[#f6f6f8] font-fredoka"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-12 w-full max-w-6xl">
        {/* Left: NFT Image & Stage */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center">
         <div className="relative w-[400px] h-[400px] rounded-3xl overflow-hidden bg-linear-to-br from-[#faf9ff] to-[#ecebff] shadow-[0_15px_50px_rgba(124,66,240,0.25)] border border-[#E5E4F2] backdrop-blur-md">
  {loadingImage ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/60">
      <Loader2 className="animate-spin text-[#7C42F0]" size={44} />
      <p className="text-sm font-medium">Loading NFT...</p>
    </div>
  ) : (
    <img
      src={showNftImage}
      alt="NFT preview"
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      style={{
        filter: "contrast(1.1) brightness(1.05)",
        imageRendering: "auto",
      }}
      loading="lazy"
    />
  )}

  {/* ✨ Gloss overlay for an HD sheen effect */}
  <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-white/40 mix-blend-overlay pointer-events-none"></div>

  {/* 🪞 Light reflection */}
  <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/40 via-transparent to-transparent opacity-30 mix-blend-screen pointer-events-none"></div>
</div>


          <div className="mt-4">
            <span className="px-4 py-1 rounded-2xl border border-[#DDDDE4] bg-[#FCFCFD] text-[12px] text-gray-700 font-medium">
              {user?.nftStage > 0 ? `Stage ${user?.nftStage}` : "Stage 1"}
            </span>
          </div>
        </div>

        {/* Right: Action Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
           { user?.nftMinted ? "Your NFT Journey" : "Royale NFT"}
          </h1>
          <h2 className="text-[16px] text-[#75758A] leading-normal font-inter mb-6">
            {nft
              ? nft?.description
              : "Mint this NFT to begin your journey. Each game you play brings you closer to the ultimate form of the NFT and may qualify you for future rewards."}
          </h2>

          {/* Action Buttons */}
          <div>
            {user?.nftMinted ? (
              <button
                onClick={redirect_To_gameplay}
                className="bg-linear-to-r from-[#7c42f0] to-[#3494f4] w-full md:w-[60%] cursor-pointer text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Start Tap Game
              </button>
            ) : (
              <button
                onClick={handleMintValidation}
                className="w-full bg-[#7C42F0] cursor-pointer hover:bg-[#6a38d4] text-[#F6F6F8] px-8 py-4 rounded-xl font-semibold transition-transform transform hover:scale-105 shadow-md"
              >
                Mint NFT
              </button>
            )}

            {/* Info Card */}
            {user?.nftMinted && (
              <div className="mt-6 p-4 border border-[#DDDDE4] rounded-xl bg-[#FCFCFD] flex flex-col gap-2 font-inter">
                <div className="flex justify-between text-[14px]">
                  <span>Token ID</span>
                  <span>#{user?.tokenId}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span>Minted on</span>
                  <span>
                    {new Date(user?.mintedDate)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}{" "}
                    UTC
                  </span>
                </div>
              <div className="flex justify-between text-[14px]">
  <span>tx hash</span>
  <span>
    {user?.mintTxHash ? (
      <a
        href={`https://explorer.irys.xyz/tx/${user.mintTxHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline break-all"
      >
        {user.mintTxHash.slice(0, 6)}...{user.mintTxHash.slice(-6)}
      </a>
    ) : (
      "-"
    )}
  </span>
</div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <MintNftModal
          onClose={() => setShowMintModal(false)}
          onSuccess={async () => {
            await refreshUserData();
            if (user?.nftMetadataUrl) {
              await fetchUserNft(user?.nftMetadataUrl);
            }
          }}
        />
      )}
    </div>
  );
};

export default MintNftSection;
