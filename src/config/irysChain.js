// src/config/irysChain.js
import { defineChain } from "viem";

export const irysTestnet = defineChain({
  id: 1270, // example chain ID, replace with actual Irys testnet chainId
  name: "Irys Testnet",
  network: "Irys Testnet v1",
  nativeCurrency: {
    name: "Irys Token",
    symbol: "IRYS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-rpc.irys.xyz/v1/execution-rpc"], // 🔹 replace with your actual testnet RPC
    },
    public: {
      http: ["https://testnet-rpc.irys.xyz/v1/execution-rpc"],
    },
  },
  blockExplorers: {
    default: { name: "IrysScan", url: "https://explorer.irys.xyz" },
  },
  testnet: true,
});
