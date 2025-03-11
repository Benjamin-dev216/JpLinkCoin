import { useState } from "react";
import "./App.css";
import Landing from "./page/Landing";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi/config";
import { ConnectKitProvider } from "connectkit";


const queryClient = new QueryClient();

function App() {


  return (
    <>
      {/* <Landing /> */}
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="midnight">
            {/* <ConnectWallet /> */}
            <Landing />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
