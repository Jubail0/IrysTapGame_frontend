import React, { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import Loader from "../Components/Loader";
import api from "../api/axios";
import { useUserStore } from "../Store/useUserStore";
import { useNFTStore } from "../Store/useNftStore";
import NftCard from "../Components/NftCard";
import { useNavigate } from "react-router-dom";

const DEFAULT_DP =
  "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, fetchUser, loading } = useUserStore();
  const { fetchUserNft, nft } = useNFTStore();

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);


  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  // --- Redirect if no wallet connected ---
  useEffect(() => {
    if (!user?.walletAddress) {
      navigate("/", { replace: true });
    }
  }, [user?.walletAddress, navigate]);

  // --- Fetch user & NFT data ---
  useEffect(() => {
    if (user?.walletAddress) {
      fetchUser(user.walletAddress);
      fetchUserNft(user?.nftMetadataUrl);
    }
  }, [user?.walletAddress, user?.nftMetadataUrl]);

  // --- Fetch game history ---
  useEffect(() => {
    const fetchGamehistory = async () => {
      try {
        const res = await api.get(`/api/profile/${user?.walletAddress}`);
        setGameHistory(
          res.data.gameHistory.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.error("Error fetching game history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    if (user?.walletAddress) fetchGamehistory();
  }, [user?.walletAddress]);

  // --- Determine theme color (purple vs flame) ---
  const nftStage =
    user?.nftStage ||
    nft?.attributes?.find((a) => a.trait_type === "Stage")?.value ||
    1;
  const isFlame = Number(nftStage) >= 4;

  // Dynamic theme palette
  const theme = {
    primary: isFlame ? "#ff6a00" : "#7c42f0",
    primaryHover: isFlame ? "#ff8800" : "#6b3ae0",
    bg: isFlame ? "#fff5f0" : "#f6f6f8",
  };

  // --- Profile image logic ---
  const currentDp = user?.dp || DEFAULT_DP;
  const displayImage = previewImage || currentDp;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user?.walletAddress) return;
    const formData = new FormData();
    if (newUsername) formData.append("username", newUsername);
    if (newImage) formData.append("file", newImage);
    formData.append("walletAddress", user?.walletAddress);
    await updateUserProfile(formData);
    setIsEditing(false);
    setPreviewImage(null);
    setNewImage(null);
  };

  return (
    <div
      className="min-h-screen font-fredoka flex flex-col items-center px-6 py-16 transition-colors duration-700"
      style={{ backgroundColor: theme.bg }}
    >
      {/* --- HERO SECTION --- */}
      <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl p-8 w-full max-w-4xl text-center">
        <div className="flex flex-col items-center">
          <img
            src={displayImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 shadow-md object-cover"
            style={{ borderColor: theme.primary }}
          />
          <h1
            className="text-3xl font-bold mt-4 transition-colors"
            style={{ color: theme.primary }}
          >
            {user?.username || "Unnamed User"}
          </h1>
          <p className="text-gray-500 font-inter text-sm">
            {user?.walletAddress?.slice(0, 4)}....
            {user?.walletAddress?.slice(-4)}
          </p>

          <button
            onClick={() => {
              setIsEditing(true);
              setNewUsername(user?.username || "");
              setPreviewImage(null);
            }}
            className="mt-4 flex items-center gap-2 text-white px-5 py-2 rounded-xl transition"
            style={{ backgroundColor: theme.primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = theme.primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = theme.primary)
            }
          >
            <Pencil size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* --- GAME STATS --- */}
      <div className="w-full max-w-4xl mt-12 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-8">
        <h2
          className="text-2xl font-bold mb-6 transition-colors"
          style={{ color: theme.primary }}
        >
          Game Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Highest Score", value: user?.bestScore },
            { label: "Total Score", value: user?.totalScore },
            { label: "Games Played", value: user?.totalGamesPlayed },
            { label: "Time Spent", value: user?.totalTimeSec },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#f9f9fb] border border-[#e5e5e9]"
            >
              <p className="text-sm text-gray-500 font-inter">{item.label}</p>
              <h3
                className="text-2xl font-bold mt-1 transition-colors"
                style={{ color: theme.primary }}
              >
                {item.value || 0}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* --- NFT SECTION --- */}
      {user?.nftMinted ? (
        <NftCard user={user} nft={nft} fetchUserNft={fetchUserNft} theme={theme}/>
      ) : (
        <div className="shadow-[0_4px_20px_rgba(0,0,0,0.1)] mt-4 bg-white p-4 rounded-2xl flex justify-center items-center flex-col">
          <p className="text-gray-800 mb-3">
            You haven’t minted your NFT yet. Mint your first NFT to begin your journey!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 text-white cursor-pointer rounded-lg font-semibold transition"
            style={{ backgroundColor: theme.primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = theme.primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = theme.primary)
            }
          >
            Go to Mint
          </button>
        </div>
      )}

      {/* --- GAME HISTORY --- */}
      <div className="w-full max-w-4xl mt-12 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-8">
        <h2
          className="text-2xl font-bold mb-6 transition-colors"
          style={{ color: theme.primary }}
        >
          Game History
        </h2>

        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader size={40} />
          </div>
        ) : gameHistory.length === 0 ? (
          <p className="text-gray-500 text-center">No game history found.</p>
        ) : (
          <div
            className={`overflow-y-auto transition-all duration-500 ${
              gameHistory.length > 15 ? "max-h-[500px]" : ""
            }`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.primary} #f9f9fb`,
            }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-[#f9f9fb] text-gray-600">
                  <th className="p-3">ID</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Saved On</th>
                  <th className="p-3">Irys Tx ID</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((game, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-[#fafafa] transition"
                  >
                    <td className="p-3 text-gray-600">{i + 1}</td>
                    <td
                      className="p-3 font-bold transition-colors"
                      style={{ color: theme.primary }}
                    >
                      {game.score}
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(game.savedAt)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}{" "}
                      UTC
                    </td>
                    <td className="p-3 text-blue-500 truncate">
                      <a
                        href={`https://gateway.irys.xyz/${game.irysTxId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {game.irysTxId.slice(0, 12)}...
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h2
              className="text-2xl font-bold mb-4 text-center transition-colors"
              style={{ color: theme.primary }}
            >
              Edit Profile
            </h2>

            <div className="flex flex-col items-center gap-4">
              <img
                src={displayImage}
                alt="New Profile"
                className="w-24 h-24 rounded-full border-4 shadow-md object-cover"
                style={{ borderColor: theme.primary }}
              />
              <label
                className="text-sm cursor-pointer hover:underline"
                style={{ color: theme.primary }}
              >
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2 font-inter focus:outline-none focus:ring-2 transition"
                style={{
                  "--tw-ring-color": theme.primary,
                  "--tw-border-color": theme.primary,
                }}
                placeholder="Enter username"
              />

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="text-white px-5 py-2 rounded-lg transition disabled:opacity-60"
                  style={{ backgroundColor: theme.primary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.primary)
                  }
                >
                  {loading ? <Loader color="#ffffff" /> : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
