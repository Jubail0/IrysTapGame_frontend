import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { irysTestnet } from "./config/irysChain";

const config = getDefaultConfig({
  appName: "Tap Tap Game",
  projectId: "4ffd1858c30d5f8163abeb87e226f4e7", 
  chains: [irysTestnet],
 
});

const queryClient = new QueryClient();

export default function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[irysTestnet]} 
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}