"use client"
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { COIN_1, COIN_2, COIN_3, COIN_4, COIN_5, COIN_6, COIN_7, COIN_8, DEFAULT_VALUE, ETH } from "../utils/saleToken";

interface SelectorProps {
  id: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  defaultValue: string;
  ignoreValue: string;
}

const TOKENS = [
  ETH,
  COIN_1,
  COIN_2,
  COIN_3,
  COIN_4,
  COIN_5,
  COIN_6,
  COIN_7,
  COIN_8,
];

const Selector: React.FC<SelectorProps> = ({ id, setToken, defaultValue, ignoreValue }) => {
  const [selected, setSelected] = useState<string>(defaultValue);
  const filteredTokens = TOKENS.filter((token) => token !== ignoreValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <Select
      value={selected !== DEFAULT_VALUE ? selected : undefined}
      onValueChange={(value) => {
        setSelected(value);
        setToken(value);
      }}
    >
      <SelectTrigger className="w-full bg-[#2c2f36] text-white">
        <SelectValue placeholder={DEFAULT_VALUE} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tokens</SelectLabel>
          {filteredTokens.map((token) => (
            <SelectItem key={token} value={token} aria-label={id}>
              {token}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Selector;