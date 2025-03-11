import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

function shotifyAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  // const { data: ensName } = useEnsName({ address });
  // const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    < button onClick={() => disconnect()
    } className="bg-[#f9b707] px-6 py-3 rounded-full font-bold shadow-lg text-lg hover:bg-[#e0a106] transition-all" > {shotifyAddress(address)}</button >
    // <div>
    //   {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
    //   {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
    //   <button onClick={() => disconnect()} className="bg-[#f9b707] px-6 py-3 rounded-full font-bold shadow-lg text-lg hover:bg-[#e0a106] transition-all">Disconnect</button>
    // </div>
  );
}
