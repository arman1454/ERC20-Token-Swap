"use client"
import React, { useEffect, useState } from "react";
import { getTokenAddress, getTokenBalance } from "@/utils/context";
import { ethers } from "ethers";
import TransactionStatus from "./TransactionStatus";
import toast from "react-hot-toast";
import {
  ClipboardIcon,
  ClipboardCheckIcon,
  PlusIcon,
} from "@heroicons/react/outline";

export interface SingleCardProps {
  index: number;
  name: string;
  walletAddress?: `0x${string}`;
}

const SingleCard: React.FC<SingleCardProps> = ({ index, name, walletAddress }) => {
  const [balance, setBalance] = useState<string>("-");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [copyIcon, setCopyIcon] = useState<{ icon: typeof ClipboardIcon }>({ icon: ClipboardIcon });
  const [txPending, setTxPending] = useState<boolean>(false);

  const notifyError = (msg: string) => toast.error(msg, { duration: 6000 });
  const notifySuccess = () => toast.success("Transaction completed.");

  useEffect(() => {
    if (name && walletAddress) {
      fetchTokenBalance();
      fetchTokenAddress();
    } else setBalance("-");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, walletAddress]);

  async function fetchTokenBalance() {
    try {
      const bal = await getTokenBalance(name, walletAddress!);
      const fBal = ethers.utils.formatUnits(bal.toString(), 18);
      setBalance(fBal.toString());
    } catch (e) {
      setBalance("-");
    }
  }

  async function fetchTokenAddress() {
    try {
      const address = await getTokenAddress(name);
      setTokenAddress(address);
    } catch (e) {
      setTokenAddress("");
    }
  }

  return (
    <article className="flex flex-col bg-[#212429]">
      <a rel="noopener noreferrer" href="#" aria-label="Te nulla oportere reprimique his dolorum">
        <img className="object-cover w-full h-62 bg-gray-500" src={`img/${index + 1}.png`} alt="" />
      </a>
      <div className="flex flex-col flex-1 p-6">
        <a aria-label="Te nulla oportere reprimique his dolorum" rel="noopener noreferrer" href=""></a>
        <a className="text-xs tracking-normal uppercase hover:underline text-[#7765F3]" rel="noopener noreferrer" href="">
          {name} 10 M Supply
        </a>
        <h3 className="flex-1 py-2 text-lg font-semibold leading-none">
          Get {name} token, limited supply available
        </h3>
        <div className="flex mx-2 pt-[10px]">
          <div className="flex items-center bg-zinc-900 text-zinc-300 w-fit p-2 px-3 rounded-l-lg">
            <p className="text-sm">{name}</p>
            <p className="bg-zinc-800 p-0.5 px-3 ml-3 rounded-lg text-zinc-100">{balance}</p>
          </div>
          <div className="flex items-center p-2 px-2 bg-[#7765F3] rounded-r-lg">
            <copyIcon.icon
              className="h-6 cursor-pointer"
              onClick={() => {
                if (tokenAddress) {
                  navigator.clipboard.writeText(tokenAddress);
                  setCopyIcon({ icon: ClipboardCheckIcon });
                }
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default SingleCard;
