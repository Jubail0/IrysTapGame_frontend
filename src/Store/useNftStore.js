import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";


// ✅ Zustand store for NFT
export const useNFTStore = create(
  persist(
    (set, get) => ({
      nft: null,
      loading: false,
      error: null,

      // ✅ Fetch NFT metadata safely
      fetchUserNft: async (metadataUrl) => {
        console.log("fetchig Nft")
        if (!metadataUrl) {
          console.warn("⚠️ No metadata URL provided for fetchUserNft()");
          return;
        }

        set({ loading: true });

        try {
          const res = await axios.get(metadataUrl);
          set({ nft: res.data, error: null });
         
        } catch (err) {
          console.error("❌ Failed to fetch NFT metadata:", err);
          set({ error: err.message || "Failed to load NFT" });
        } finally {
          set({ loading: false });
        }
      },

      // ✅ Reset NFT state
      resetNft: () => set({ nft: null, error: null }),
    }),
    {
      name: "nft-storage",
      version: 1,
      migrate: (persistedState, version) => persistedState, // prevent migration warning
      partialize: (state) => ({ nft: state.nft }),
    }
  )
);
