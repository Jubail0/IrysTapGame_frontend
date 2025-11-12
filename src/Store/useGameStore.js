import { create } from "zustand";
import api from "../api/axios.js";
import { notifySuccess, notifyError } from "../Utils/notify.js";
import { useUserStore } from "./useUserStore.js";


export const useGameStore = create((set, get) => ({
  recentGames: [],
  loading: false,
  error: null,

  fetchRecentGames: async () => {
    try {
      const res = await api.get("/api/public/recent");
      set({ recentGames: res.data, loading: false });
      console.log("Recent games loaded!");
    } catch (error) {
      console.error("Error fetching recent games:", error);
      set({ error: error.message });
      console.warn("Failed to load recent games");
    }
  },

  saveScore: async (score, setHandleSpam, signMessageAsync) => {
    const walletAddress = useUserStore.getState().user?.walletAddress;

    if (!walletAddress) {
      notifyError("Wallet not connected");
      return;
    }

    set({ loading: true, error: null });

    try {
      // 1️⃣ Get nonce from backend
      const nonceRes = await api.get(`/api/game/nonce?walletAddress=${walletAddress}`);
      const { nonce } = nonceRes.data;

      // 2️⃣ Prepare message
      const message = `Submit score ${score} - nonce: ${nonce}`;

      // 3️⃣ Sign message using Wagmi hook
      const signature = await signMessageAsync({ message });

      // 4️⃣ Send signed message to backend
      const res = await api.post("/api/game/save", {
        walletAddress,
        score,
        signature,
      });

      if (res.data.success) {
        notifySuccess(res.data.message);
        setHandleSpam(true);
      } else {
        setHandleSpam(false);
        notifyError(res.data.message || "Failed to save score.");
      }

      set({ loading: false });
    } catch (error) {
      if (error.response?.status === 429) {
        notifyError(error.response.data.error);
      } else {
        setHandleSpam(false);
        notifyError("Something went wrong while saving the score.");
        set({ loading: false, error });
        console.log(error);
      }
    }
  },
}));
