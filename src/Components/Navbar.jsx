import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useUserStore } from "../Store/useUserStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { irysTestnet } from "../config/irysChain";
import { notifySuccess, notifyError } from "../Utils/notify";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const { loginUser, logout, user } = useUserStore();
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hasDisconnected, setHasDisconnected] = useState(false);
  const menuRef = useRef(null);

  // Handle wallet connection changes
  useEffect(() => {
    const handleWalletChange = async () => {
      // User disconnected
      if (!isConnected && user?.walletAddress) {
        logout();
        setHasDisconnected(true);
        return;
      }

      // If user manually disconnected, do not auto login
      if (isConnected && hasDisconnected) return;

      // If wallet connected
      if (isConnected && address) {
        if (user?.walletAddress === address) return; // Already logged in

        // Switch chain if needed
        if (chainId !== irysTestnet.id) {
          try {
            await switchChainAsync?.({ chainId: irysTestnet.id });
            notifySuccess("Switched to Irys Testnet ✅");
          } catch {
            notifyError("Please switch to Irys Testnet manually!");
            return;
          }
        }

        loginUser(address);
        setHasDisconnected(false); // Reset disconnect flag
      }
    };

    handleWalletChange();
  }, [isConnected, address, chainId, status]);

  const links = [
    { path: "/", label: "Game" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  if (user?.walletAddress) {
    links.splice(1, 0, { path: "/profile", label: "Profile" });
  }

  return (
    <nav className="w-full bg-[#FCFCFD] shadow-md px-4 py-4 relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-[#7C42F0] font-fredoka"
        >
          Tap Tap
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-[#7C42F0] border-b-2 border-[#7C42F0] pb-1"
                    : "text-[#22222a] hover:text-[#7C42F0]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Wallet Button (Desktop) */}
        <div className="hidden md:flex items-center">
          <ConnectButton showBalance={true} chainStatus="icon" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center text-[#7C42F0]"
          onClick={() => setMenuOpen((p) => !p)}
        >
          <motion.div
            initial={false}
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-lg mt-4 p-5 flex flex-col gap-5"
        >
          {links.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block transition ${
                  isActive
                    ? "text-[#7C42F0] border-b-2 border-[#7C42F0] pb-1"
                    : "text-[#22222a] hover:text-[#7C42F0]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-gray-200">
            <ConnectButton showBalance={true} chainStatus="icon" />
          </div>
        </motion.div>
      </div>
    </nav>
  );
}

export default Navbar;
