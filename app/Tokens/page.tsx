"use client"
import React, { useEffect, useState } from "react";
import { getAllHistory } from "@/utils/context";
import  Table  from "@/components/Table";

// Import the HistoryItem type from the Table component
import type { HistoryItem } from "@/components/Table";

const Page: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadData = async () => {
    const data = await getAllHistory();
    setHistory(Array.isArray(data) ? data.reverse() : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-[#1A1A1A]">
      <div className="p-[80px]">
        <Table history={history} />
      </div>
    </div>
  );
};

export default Page;
