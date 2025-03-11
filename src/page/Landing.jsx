import React, { useEffect, useState, useRef } from "react";
import { parseEther, formatEther } from "viem";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
  usePublicClient,
} from "wagmi";
import { getBalance, readContract } from "@wagmi/core";
import { WalletOptions } from "../wagmi/wallet-options";
import { Account } from "../wagmi/account";
import CoinInput from "../component/CoinInput";
import { ArrowDownUp } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { config } from "../wagmi/config";

import abi from "../contract/abi";
import tokenAbi from "../contract/tokenAbi";
import getContractsAddress from "../contract/address";

const tokenA = "0x45cc2a228a82d65ee886167d675607f9fdaa5975"; //JpLinkCoin
const tokenB = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"; // WPOL
const MAX_APPROVE_AMOUNT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const toastSetting = {
  duration: 2000,
  // Styling
  style: {},
  className: "",
  // Change colors of success/error/loading icon
  iconTheme: {
    primary: "#000",
    secondary: "#fff",
  },
  // Aria
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
  // Additional Configuration
  removeDelay: 1000,
};

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

export default function Landing() {
  const publicClient = usePublicClient();
  const { isConnected, address } = useAccount();
  const {
    data: hash,
    isPending,
    writeContract,
    writeContractAsync,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [order, setOrder] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [approve, setApprove] = useState(false);
  const [jplinkValue, setJplinkValue] = useState("0");
  const [polValue, setPolValue] = useState("0");

  useEffect(() => {
    if (isConnected || isConfirmed) {
      readContract(config, {
        address: tokenA,
        abi: tokenAbi,
        functionName: "balanceOf",
        args: [address],
      }).then((result) => {
        setJplinkValue(formatEther(result).slice(0, 5));
      });
      getBalance(config, {
        address: address,
      }).then((result) => {
        setPolValue(formatEther(result.value).slice(0, 5));
      });
    } else {
      setJplinkValue("0");
      setPolValue("0");
    }
  }, [isConnected, isConfirmed]);

  const onAmountChange = async (amountIn, selectBool) => {
    const uniswapRouterAddress = getContractsAddress();
    if (selectBool) {
      setInputValue(amountIn);
    } else {
      setOutputValue(amountIn);
    }
    try {
      const result = await readContract(config, {
        address: uniswapRouterAddress,
        abi: abi,
        functionName: selectBool ? "getAmountsIn" : "getAmountsOut",
        args: [
          parseEther(amountIn.length > 0 ? amountIn.toString() : "0"),
          [order ? tokenA : tokenB, order ? tokenB : tokenA],
        ],
      });
      if (selectBool) {
        setOutputValue(formatEther(result?.[0] || "0"));
      } else {
        setInputValue(formatEther(result?.[1] || "0"));
      }
    } catch (error) {
      console.error("Error fetching token amount:", error);
      selectBool ? setOutputValue("") : setInputValue("");
    }
  };
  const onSwap = async () => {
    if (!publicClient || !publicClient.transport?.url) {
      console.error(
        "No provider availabe. Ensure Wagmi is configured properly."
      );
      return;
    }
    if (!isConnected)
      return toast.error("Please connect your wallet", toastSetting);
    if (
      inputValue === "0" ||
      inputValue === "" ||
      outputValue === "0" ||
      outputValue === ""
    )
      return toast.error("Please enter a valid amount", toastSetting);

    const uniswapRouterAddress = getContractsAddress();

    if (!order) {
      const approval = await publicClient.readContract({
        address: tokenA,
        abi: tokenAbi,
        functionName: "allowance",
        args: [address, uniswapRouterAddress],
      });

      if (approval < parseEther(inputValue)) {
        setApprove(true);
        writeContract({
          address: tokenA,
          abi: tokenAbi,
          functionName: "approve",
          args: [uniswapRouterAddress, MAX_APPROVE_AMOUNT],
        });
        setApprove(false);
      }

      if (approval >= parseEther(inputValue) || isConfirmed)
        writeContract({
          address: uniswapRouterAddress,
          abi,
          functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
          args: [
            parseEther(inputValue),
            0,
            [tokenA, tokenB],
            address,
            parseInt(new Date().getTime() / 1000) + 1200,
          ],
        });
    } else {
      writeContract({
        address: uniswapRouterAddress,
        abi,
        functionName: "swapExactETHForTokensSupportingFeeOnTransferTokens",
        value: parseEther(inputValue),
        args: [
          0,
          [tokenB, tokenA],
          address,
          parseInt(new Date().getTime() / 1000) + 1200,
        ],
      });
    }
  };
  const onOrder = () => {
    setOrder(!order);
    const temp = inputValue;
    setInputValue(outputValue);
    setOutputValue(temp);
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-[#000411] p-8 w-screen">
        {/* Connect Button Positioned at the Top-Right Corner */}
        <div className="absolute top-6 right-6">
          <ConnectWallet />
        </div>

        <div className="bg-[#000411] p-10 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col items-center gap-2 relative">
          <div className="relative w-full">
            <CoinInput
              billingType={"Sell"}
              coinType={order ? "Polygon" : "JpLinkCoin"}
              disabled={!order}
              value={inputValue}
              onChangeValue={(value) => onAmountChange(value, true)}
              polValue={polValue}
              jplinkValue={jplinkValue}
            />
          </div>

          {/* Swap Button Positioned Overlapping the Two Rectangles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              className="bg-[#000411] text-white rounded-full w-14 h-14 -mt-16 flex items-center justify-center shadow-md transition-all hover:scale-110 focus:outline-none focus:ring-0 active:outline-none active:ring-0 border-none"
              onClick={onOrder}
            >
              <ArrowDownUp size={30} />
            </button>
          </div>

          <div className="relative w-full">
            <CoinInput
              billingType={"Buy"}
              coinType={order ? "JpLinkCoin" : "Polygon"}
              disabled={order}
              value={outputValue}
              onChangeValue={(value) => onAmountChange(value, false)}
              polValue={polValue}
              jplinkValue={jplinkValue}
            />
          </div>

          <button
            className="bg-[#f9b707] w-full py-4 h-14 rounded-full font-bold text-lg shadow-lg hover:bg-[#e0a106] transition-all"
            disabled={isConfirming || isPending}
            onClick={onSwap}
          >
            {isConfirming || isPending ? (
              <PropagateLoader color="#FFF" size={10} />
            ) : approve ? (
              "Approve"
            ) : (
              "Swap"
            )}
          </button>
          <Toaster />
        </div>
      </div>
    </>
  );
}
