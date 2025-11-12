import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios.js" // ✅ use global axios instance
import { notifySuccess, notifyError } from "../Utils/notify.js";
import { useNFTStore } from "./useNftStore.js";
export const useUserStore = create(
  persist(
    (set, get) => ({
      user:null,
      loading: false,
      error: null,

      // ✅ Fetch user by wallet address
      fetchUser: async (walletAddress) => {
        
        try {
          set({ loading: true, error: null });
          const res = await api.get(`/api/profile/${walletAddress}`);
          set({ user: res.data.user, loading: false });
          // notifySuccess("User data loaded!");
        } catch (err) {
          console.error("Error fetching user:", err);
          
          set({ loading: false, error: err.message });
        }
      },

      // ✅ Login / connect wallet — creates new user if not exists
      loginUser: async (walletAddress) => {
      const {fetchUserNft, user} = useNFTStore.getState()
        try {
          set({ loading: true, error: null });
          const res = await api.post("/api/auth/connect-wallet", { walletAddress });
            set({
             user: res.data.user,
             loading: false
            });

            if(res?.data?.user?.nftMinted) fetchUserNft(user?.nftMetadataUrl)
          notifySuccess("Wallet connected successfully!");
        } catch (err) {
          console.error("Login Failed", err);
          notifyError("Login Failed");
          set({ loading: false, error: err.message });
        }
      },

      // ✅ Update user profile (username & dp)
      updateUserProfile: async (formData) => {
  const { user } = get();
  if (!user?.walletAddress) {
    notifyError("User not logged in");
    return;
  }

  try {
    set({ loading: true });

    // ✅ Send directly to backend upload route
    const res = await api.put("/api/profile/update",formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Update user store with latest data
    set({ user: res.data.user, loading: false });
    notifySuccess("Profile updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    notifyError("Failed to update profile");
    set({ loading: false, error: err.message });
  }
},


      // ✅ Refresh user after mint success
      refreshUserData: async () => {
        const { user, fetchUser } = get();
        if (user?.walletAddress) await fetchUser(user?.walletAddress);
      },

      // ✅ Logout
      logout: async() => {
         const {resetNft} = useNFTStore.getState()
        set({ user: null });
        await resetNft()
        notifySuccess("Logged out successfully");
      },

      // ✅ Manually set user
      setUser: (newUserData) => {
        set({ user: newUserData });
      }
    }),
    {
      name: "user-storage", // localStorage key
      partialize: (state) => ({ user: state.user }), // persist only user data
    }
  )
);
