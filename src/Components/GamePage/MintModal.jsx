import React, { useState } from "react";
import { notifySuccess, notifyError } from "../../Utils/notify";
import api from "../../api/axios";
import {
  useAccount,
  useSignMessage,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  usePublicClient,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../Utils/contractConfig";
import { parseEther,decodeEventLog  } from "viem";
import { irysTestnet } from "../../config/irysChain";


const MINT_PRICE = parseFloat(import.meta.env.VITE_MINT_PRICE || "0.01");
const nftPreviewImage = "https://uploader.irys.xyz/7VTcTZGZcEJ3u64rFHhr176rac2AMG9g8noEUgB6om73";
const MintNftModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient({ chainId: irysTestnet.id });

  const { data: balanceData } = useBalance({
    address,
    chainId: irysTestnet.id,
    watch: true,
  });

  const { data: txHash, writeContractAsync } = useWriteContract();
  const { isLoading: txLoading } = useWaitForTransactionReceipt({ hash: txHash });

  // 🔒 Safe API wrapper
  const safeApiCall = async (fn) => {
    try {
      const res = await fn();
      return res?.data || null;
    } catch (err) {
      console.error("⚠️ Backend call failed:", err);
      notifyError("Backend request failed. Try again later.");
      return null;
    }
  };

  const handleMint = async () => {
  if (!isConnected) {
    return notifyError("Please connect your wallet first!");
  }

  setLoading(true);

  try {
    // 🧮 Step 1 — Check user balance
    const balance = parseFloat(balanceData?.formatted || "0");
    if (balance < MINT_PRICE) {
      notifyError(`Insufficient balance (need ${MINT_PRICE} IRYS)`);
      return;
    }

    // 🔍 Step 2 — Check if wallet already minted
    const alreadyMinted = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "hasMinted", // or "hasMinted" depending on your contract
      args: [address],
    });

       if (alreadyMinted) {
      notifyError("You have already minted your NFT!");
      return;
    }

    // 🪪 Step 3 — Sign verification message
    const message = `TapTapNFT Mint Request for ${address} at ${Date.now()}`;
    const signature = await signMessageAsync({ message });

    // 🧾 Step 4 — Get metadata from backend
    const metadataResponse = await safeApiCall(() =>
      api.post("/api/nft/mint", { walletAddress: address })
    );

    if (!metadataResponse?.metadataUrl || !metadataResponse?.rootTxId) {
      throw new Error("Failed to upload NFT metadata to backend.");
    }

    const { metadataUrl, rootTxId } = metadataResponse;
    console.log("✅ Metadata URL:", metadataUrl);

    // 🔗 Step 5 — Call smart contract
    let txHash;
    try {
      txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mintNFT",
        args: [metadataUrl],
        value: parseEther(MINT_PRICE.toString()),
        chainId: irysTestnet.id,
      });
    } catch (err) {
      console.error("⚠️ Transaction failed before submission:", err);
      throw new Error("Transaction rejected or failed before being sent.");
    }

    notifySuccess("Transaction submitted! Waiting for confirmation...");

    // ⏳ Step 6 — Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    if (receipt.status !== "success") {
      throw new Error("Transaction failed on-chain. Please try again.");
    }

    // 🔍 Step 7 — Extract tokenId from event logs
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: CONTRACT_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "NFTMinted") {
          tokenId = decoded.args.tokenId.toString();
          console.log("✅ Token ID found:", tokenId);
          break;
        }
      } catch {
        // ignore unrelated logs
      }
    }

    if (!tokenId) {
      throw new Error("Mint succeeded, but token ID could not be decoded.");
    }

    // 🧠 Step 8 — Notify backend (only after confirmed success)
    await safeApiCall(() =>
      api.post("/api/nft/mint-success", {
        walletAddress: address,
        nftMinted: true,
        nftMetadataUrl: metadataUrl,
        nftStage: 0,
        mintTxHash: txHash,
        rootTxId,
        signature,
        tokenId,
      })
    );

    // 🎉 Success feedback
    notifySuccess("NFT Minted successfully! 🎉");
    onSuccess?.();
    onClose?.();
  } catch (err) {
    console.error("❌ Mint failed:", err);

    // User-friendly error messages
    const errMsg =
      err?.shortMessage ||
      err?.message ||
      (err?.cause?.message?.includes("already minted")
        ? "You have already minted!"
        : null) ||
      "Mint failed. Please try again!";

    notifyError(errMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 font-fredoka">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center relative">
        {/* ✖ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* 🖼 NFT Preview */}
        <div className="flex justify-center mb-5">
          <div className="rounded-2xl overflow-hidden border border-[#DDDDE4] shadow-md w-[180px] h-[180px]">
            <img
              src={nftPreviewImage}
              alt="NFT Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-[#7C42F0]">Mint Your NFT</h2>
        <p className="text-gray-600 mb-6 text-sm">
          This NFT represents your first step in the Tap evolution. Once minted, your
          journey begins.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleMint}
            disabled={loading || txLoading}
            className="bg-[#7C42F0] hover:bg-[#6d37d6] text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading || txLoading ? "Minting..." : `Mint (${MINT_PRICE} IRYS)`}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintNftModal;
