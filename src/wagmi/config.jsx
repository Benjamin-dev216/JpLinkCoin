import { http, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";

const projectId = '9c88f8f2f859e411c04ea61df8c008f2'

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygon],
    transports: {
      // RPC URL for each chain
      [polygon.id]: http(
        `https://polygon.llamarpc.com`,
      ),
    },

    // Required API Keys
    walletConnectProjectId: '9c88f8f2f859e411c04ea61df8c008f2',

    // Required App Info
    appName: "JpLinkCoin",

    // Optional App Info
    appDescription: "Swap interface for JpLinkCoin",
    appUrl: "https://jplink.space/", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);