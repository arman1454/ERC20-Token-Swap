"use client"
import React from "react";
import { useAccount } from "wagmi";

import { SingleCard } from "./index";

interface CardProps {}

const Card: React.FC<CardProps> = () => {
  const { address }: { address?: `0x${string}` } = useAccount();

  return (
    <section className="py-6 sm:py-12 bg-[#1A1A1A] text-gray-100">
      <div className="container p-6 mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">All Listed Token For Sale</h2>
          <p className="font-serif text-sm text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi corrupti illum harum ea esse iusto et sapiente quam
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <SingleCard index={0} name={"Tether USD"} walletAddress={address} />
          <SingleCard index={1} name={"BNB"} walletAddress={address} />
          <SingleCard index={2} name={"USD Coin"} walletAddress={address} />
          <SingleCard index={3} name={"stETH"} walletAddress={address} />
          <SingleCard index={4} name={"TRON"} walletAddress={address} />
          <SingleCard index={5} name={"Matic Token"} walletAddress={address} />
          <SingleCard index={6} name={"SHIBA INU"} walletAddress={address} />
          <SingleCard index={7} name={"Uniswap"} walletAddress={address} />
        </div>
      </div>
    </section>
  );
};

export default Card;
