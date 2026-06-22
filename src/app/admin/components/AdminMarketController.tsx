"use client";

import React, { useState, useEffect } from "react";

export default function AdminMarketController() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState("");
  const [customStrength, setCustomStrength] = useState("");

  useEffect(() => {
    const handleLoadPairs = () => {
      const saved = localStorage.getItem("global_tradingview_pairs");
      if (saved) setPairs(JSON.parse(saved));
    };
    handleLoadPairs();
    window.addEventListener("storage", handleLoadPairs);
    return () => window.removeEventListener("storage", handleLoadPairs);
  }, []);

  const handleUpdateAsset = (symbol: string) => {
    const updated = pairs.map((p) => {
      if (p.symbol === symbol) {
        return {
          ...p,
          price: customPrice ? Number(customPrice) : p.price,
          buyStrength: customStrength ? Math.max(0, Math.min(100, Number(customStrength))) : p.buyStrength
        };
      }
      return p;
    });
    setPairs(updated);
    localStorage.setItem("global_tradingview_pairs", JSON.stringify(updated));
    setEditingSymbol(null);
    alert("Asset metrics forced globally across all client terminal feeds!");
  };

  return (
    <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 mt-6 select-none">
      <div className="mb-4 border-b border-gray-800 pb-3">
        <h3 className="text-sm font-bold text-white">TradingView Asset & Strength Overrides</h3>
        <p className="text-xs text-gray-500 mt-0.5">Manipulate asset prices, adjust buyer/seller volumes, and adjust trade parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairs.map((pair) => (
          <div key={pair.symbol} className="bg-[#12131a] border border-gray-800/80 p-4 rounded-xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-white">{pair.symbol}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Price: ${pair.price?.toFixed(2)} | Buy: {pair.buyStrength}%</p>
            </div>

            {editingSymbol === pair.symbol ? (
              <div className="flex gap-1.5 flex-1 max-w-[200px]">
                <input type="number" placeholder="Price" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} className="w-1/2 bg-gray-950 text-white text-[11px] p-1.5 border border-gray-800 rounded outline-none" />
                <input type="number" placeholder="Buy%" value={customStrength} onChange={(e) => setCustomStrength(e.target.value)} className="w-1/2 bg-gray-950 text-white text-[11px] p-1.5 border border-gray-800 rounded outline-none" />
                <button onClick={() => handleUpdateAsset(pair.symbol)} className="bg-blue-600 text-white text-[10px] px-2 rounded">Save</button>
              </div>
            ) : (
              <button onClick={() => { setEditingSymbol(pair.symbol); setCustomPrice(pair.price.toString()); setCustomStrength(pair.buyStrength.toString()); }} className="bg-gray-800 text-gray-300 text-[11px] px-3 py-1.5 rounded-lg border border-gray-700">Tweak</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}