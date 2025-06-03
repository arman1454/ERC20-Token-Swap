"use client"
import React, { useEffect, useState, useRef } from "react";
import {
  hasValidAllowance,
  increaseAllowance,
  swapEthToToken,
  swapTokenToEth,
  swapTokenToToken,
} from "../utils/context";

import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import TransactionStatus from "./TransactionStatus";
import toast, { Toaster } from "react-hot-toast";
import { DEFAULT_VALUE, ETH } from "../utils/saleToken";
import { toEth, toWei } from "../utils/utils";
import { useAccount } from "wagmi";
import SwapField from "./SwapField";

const SwapComponent = () => {
  // Token types
  type Token = typeof ETH | typeof DEFAULT_VALUE | string;

  const [srcToken, setSrcToken] = useState<Token>(ETH);
  const [destToken, setDestToken] = useState<Token>(DEFAULT_VALUE);

  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  const inputValueRef = useRef<HTMLInputElement>(null);
  const outputValueRef = useRef<HTMLInputElement>(null);

  const isReversed = useRef(false);

  const INCREASE_ALLOWANCE = "Increase allowance";
  const ENTER_AMOUNT = "Enter an amount";
  const CONNECT_WALLET = "Connect wallet";
  const SWAP = "Swap";

  // Define obj props for SwapField
  const srcTokenObj = {
    id: "srcToken",
    value: inputValue,
    setValue: setInputValue,
    defaultValue: srcToken,
    ignoreValue: destToken,
    setToken: setSrcToken,
  };

  const destTokenObj = {
    id: "destToken",
    value: outputValue,
    setValue: setOutputValue,
    defaultValue: destToken,
    ignoreValue: srcToken,
    setToken: setDestToken,
  };

  const [swapBtnText, setSwapBtnText] = useState<string>(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const notifyError = (msg: string) => toast.error(msg, { duration: 6000 });
  const notifySuccess = () => toast.success("Transaction completed");

  const { address } = useAccount();

  useEffect(() => {
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT);
    else setSwapBtnText(SWAP);
  }, [inputValue, outputValue, address]);

  useEffect(() => {
    if (
      document.activeElement !== outputValueRef.current &&
      (document.activeElement as HTMLElement)?.ariaLabel !== "srcToken" &&
      !isReversed.current
    ) {
      populateOutputValue();
    }
    if (inputValue.length === 0) setOutputValue("");
  }, [inputValue, destToken]);

  useEffect(() => {
    if (
      document.activeElement !== inputValueRef.current &&
      (document.activeElement as HTMLElement)?.ariaLabel !== "destToken" &&
      !isReversed.current
    ) {
      populateInputValue();
    }
    if (outputValue.length === 0) setInputValue("");
    if (isReversed.current) isReversed.current = false;
  }, [outputValue, srcToken]);

  async function handleSwap() {
    if (srcToken === ETH && destToken !== ETH) {
      performSwap();
    } else {
      setTxPending(true);
      if (!address) {
        setTxPending(false);
        notifyError("No wallet address");
        return;
      }
      const result = await hasValidAllowance(address, srcToken, inputValue);
      setTxPending(false);
      if (result) performSwap();
      else handleInsufficientAllowance();
    }
  }

  async function handleIncreaseAllowance() {
    setTxPending(true);
    await increaseAllowance(srcToken, inputValue);
    setTxPending(false);
    setSwapBtnText(SWAP);
  }

  function handleReverseExchange(e: React.MouseEvent) {
    isReversed.current = true;
    setInputValue(outputValue);
    setOutputValue(inputValue);
    setSrcToken(destToken);
    setDestToken(srcToken);
  }

  function getSwapBtnClassName() {
    let className = "p-4 w-full my-2 roundex-xl";
    className += swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
      ? "text-zinc-400 bg-zinc-800 pointer-events-none" : "bg-blue-700";
    className += swapBtnText === INCREASE_ALLOWANCE ? "bg-yellow-600" : "";
    return className;
  }

  function populateOutputValue() {
    if (destToken === DEFAULT_VALUE || srcToken === DEFAULT_VALUE || !inputValue)
      return;
    try {
      if (srcToken !== ETH && destToken !== ETH) setOutputValue(inputValue);
      else if (srcToken === ETH && destToken !== ETH) {
        const outValue = toEth(toWei(inputValue), 14);
        setOutputValue(outValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        const outValue = toEth(toWei(inputValue, 14));
        setOutputValue(outValue);
      }
    } catch (error) {
      setOutputValue("0");
    }
  }

  function populateInputValue() {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !outputValue
    )
      return;
    try {
      if (srcToken !== ETH && destToken !== ETH) setInputValue(outputValue);
      else if (srcToken === ETH && destToken !== ETH) {
        const outValue = toEth(toWei(outputValue, 14));
        setInputValue(outValue);
      } else if (srcToken !== ETH && destToken === ETH) {
        const outValue = toEth(toWei(outputValue), 14);
        setInputValue(outValue);
      }
    } catch (error) {
      setInputValue("0");
    }
  }

  async function performSwap() {
    setTxPending(true);
    let receipt;
    if (srcToken === ETH && destToken !== ETH)
      receipt = await swapEthToToken(destToken, inputValue);
    else if (srcToken !== ETH && destToken === ETH)
      receipt = await swapTokenToEth(srcToken, inputValue);
    else receipt = await swapTokenToToken(srcToken, destToken, inputValue);
    setTxPending(false);
    if (receipt && !receipt.hasOwnProperty("transactionHash"))
      notifyError(receipt);
    else notifySuccess();
  }

  function handleInsufficientAllowance() {
    notifyError(
      "Insufficient allowance. Click 'Increase allowance' to increase it."
    );
    setSwapBtnText(INCREASE_ALLOWANCE);
  }

  return (
    <div className="border-[1px] rounded-l border-[#7765F3] bg-[#7765F3] w-[100%] p-4 px-6 rounded-xl">
      <div className="flex items-center justify-between py-4 px-1">
        <p>Swap</p>
        <CogIcon className="h-6" />
      </div>
      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600">
        <SwapField obj={srcTokenObj} ref={inputValueRef} />
        <ArrowSmDownIcon className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110"
          onClick={handleReverseExchange}
        />
      </div>
      <div className="bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600">
        <SwapField obj={destTokenObj} ref={outputValueRef} />
      </div>
      <button className={getSwapBtnClassName()} onClick={() => {
        if (swapBtnText === INCREASE_ALLOWANCE) handleIncreaseAllowance();
        else if (swapBtnText === SWAP) handleSwap();
      }}>
        {swapBtnText}
      </button>
      {txPending && <TransactionStatus />}
      <Toaster />
    </div>
  );
}

export default SwapComponent;