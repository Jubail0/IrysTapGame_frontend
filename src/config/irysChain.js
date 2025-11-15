// src/config/irysChain.js
import { defineChain } from "viem";

// 🔹 Your backend route (from .env)
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const irysTestnet = defineChain({
  id: 1270, // Irys Testnet Chain ID
  name: "Irys Testnet",
  network: "irys-testnet",

  nativeCurrency: {
    name: "Irys Token",
    symbol: "IRYS",
    decimals: 18,
  },

  rpcUrls: {
    default: {
      http: [
        // 🔹 Frontend will *NOT* call this directly
        //     Backend will proxy RPC calls.
        `${BACKEND_URL}/api/public/irys-rpc` 
      ],
    },
    public: {
      http: [
        `${BACKEND_URL}/api/public/irys-rpc`
      ],
    },
  },

  blockExplorers: {
    default: {
      name: "IrysScan",
      url: "https://explorer.irys.xyz",
    },
  },

  testnet: true,
});
