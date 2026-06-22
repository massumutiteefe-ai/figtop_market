"use client";

import React, { useState } from "react";

interface PostSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
}

export default function PostSignalModal({ isOpen, onClose, expertName }: PostSignalModalProps) {
  const [assetPair, setAssetPair] = useState("");
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [entryPrice, setEntryPrice] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetPair || !entryPrice || !takeProfit || !stopLoss) {
      return alert("Please fill out all trade execution parameters!");
    }

    setIsPublishing(true);

    setTimeout(() => {
      const newSignal = {
        id: `sig_${Date.now()}`,
        expertName,
        assetPair: assetPair.toUpperCase(),
        action,
        entryPrice,
        takeProfit,
        stopLoss,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Read current signals from data feed store layers
      const rawSignals = localStorage.getItem("global_trading_signals");
      const currentSignals = rawSignals ? JSON.parse(rawSignals) : [];
      
      // Save directly to cross-tab synchronization pipeline layers
      currentSignals.unshift(newSignal);
      localStorage.setItem("global_trading_signals", JSON.stringify(currentSignals));

      alert("Trade signal published live successfully!");
      
      // Reset forms
      setAssetPair("");
      setEntryPrice("");
      setTakeProfit("");
      setStopLoss("");
      setIsPublishing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-md bg-[#16181f] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-sm">✕</button>

        <h3 className="text-lg font-bold text-white mb-1">Publish Live Market Signal</h3>
        <p className="text-xs text-gray-400 mb-6">Broadcast entry parameters directly to the platform feed network terminals.</p>

        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Asset Pair / Symbol</label>
            <input type="text" placeholder="e.g., BTC/USD" value={assetPair} onChange={(e) => setAssetPair(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 text-xs p-2.5 rounded-lg text-white outline-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Action Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setAction("BUY")} className={`py-2 text-xs font-bold rounded-lg border transition ${action === "BUY" ? "bg-emerald-600/10 border-emerald-500 text-emerald-400" : "bg-[#12131a] border-gray-800 text-gray-500"}`}>BUY / LONG</button>
              <button type="button" onClick={() => setAction("SELL")} className={`py-2 text-xs font-bold rounded-lg border transition ${action === "SELL" ? "bg-rose-600/10 border-rose-500 text-rose-400" : "bg-[#12131a] border-gray-800 text-gray-500"}`}>SELL / SHORT</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-1">Entry Price</label>
              <input type="text" value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 text-xs p-2 rounded-lg text-white outline-none" />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-1">Take Profit</label>
              <input type="text" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 text-xs p-2 rounded-lg text-white outline-none" />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-gray-400 mb-1">Stop Loss</label>
              <input type="text" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 text-xs p-2 rounded-lg text-white outline-none" />
            </div>
          </div>

          <button type="submit" disabled={isPublishing} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-2.5 rounded-xl text-xs tracking-wide transition mt-2">
            {isPublishing ? "Broadcasting signal..." : "Publish Live Signal"}
          </button>
        </form>
      </div>
    </div>
  );
}