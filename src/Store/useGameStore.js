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
      
      const res = await api.get("/public/recent");
      set({ recentGames: res.data, loading: false });
      console.log("Recent games loaded!");
    } catch (error) {
      console.error("Error fetching recent games:", error);
      set({ error: error.message});
      console.warn("Failed to load recent games");
    }
  },

  saveScore : async (score, setHandleSpam) => {
    const walletAddress = useUserStore.getState().user?.walletAddress;
    set({ loading: true, error: null });
    try {
        const res = await api.post('/game/save',{
            walletAddress,
            score
        })
        if(res.data.success) notifySuccess(res.data.message)
        setHandleSpam(true)
        set({ loading: false });
     
    } catch (error) {
          if (error.response?.status === 429) {
          notifyError(error.response.data.error);
          } else {
          setHandleSpam(false)
          notifyError("Something went wrong while saving the score.");
          set({ loading: false, error });
          console.log(error)
          }
       
       
      
    }
  }
}));
