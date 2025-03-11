import * as React from 'react'
import { useConnect } from 'wagmi'
import { ConnectKitButton } from "connectkit";

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return (
    <div>
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <button className="bg-[#f9b707] px-6 py-3 rounded-full font-bold shadow-lg text-lg hover:bg-[#e0a106] transition-all" onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  )
}