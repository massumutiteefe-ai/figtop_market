"use client";

import React, { useState, useEffect } from "react";

interface MarketAsset {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  category: "Indices" | "Futures" | "Bonds" | "Forex";
  logoText?: string;
  logoBg?: string;
}

export default function TradingTerminal() {
  const [activeTab, setActiveTab] = useState<"Indices" | "Futures" | "Bonds" | "Forex">("Indices");
  const [progress, setProgress] = useState(0);
  
  // Real-time volatility simulation for the trade progress bar loop
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + Math.floor(Math.random() * 4) + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Live market asset datastores
  const [assets] = useState<MarketAsset[]>([
    { symbol: "BTCUSD", name: "Bitcoin / U.S. Dollar", price: "74,008.14", change: "+206.01", changePercent: "+0.28%", isPositive: true, category: "Indices", logoText: "₿", logoBg: "bg-amber-500" },
    { symbol: "NAS100USD", name: "US Nas 100", price: "30,326.20", change: "+74.40", changePercent: "+0.25%", isPositive: true, category: "Indices", logoText: "100", logoBg: "bg-sky-600" },
    { symbol: "SPX500", name: "S&P 500 Index", price: "7,577.90", change: "+6.70", changePercent: "+0.09%", isPositive: true, category: "Indices", logoText: "500", logoBg: "bg-rose-600" },
    
    { symbol: "ES1!", name: "E-mini S&P 500 Futures", price: "5,410.25", change: "-12.50", changePercent: "-0.23%", isPositive: false, category: "Futures", logoText: "ES", logoBg: "bg-slate-700" },
    { symbol: "NQ1!", name: "Nasdaq 100 Futures", price: "19,204.50", change: "+45.00", changePercent: "+0.23%", isPositive: true, category: "Futures", logoText: "NQ", logoBg: "bg-sky-700" },
    
    { symbol: "US10Y", name: "U.S. 10 Year Bond", price: "4.2340", change: "+0.012", changePercent: "+0.28%", isPositive: true, category: "Bonds", logoText: "10Y", logoBg: "bg-emerald-600" },
    { symbol: "DE10Y", name: "Germany 10 Year Bond", price: "2.4150", change: "-0.005", changePercent: "-0.21%", isPositive: false, category: "Bonds", logoText: "EU", logoBg: "bg-indigo-600" },
    
    { symbol: "EURUSD", name: "EUR / USD", price: "1.08450", change: "-0.0012", changePercent: "-0.11%", isPositive: false, category: "Forex", logoText: "€", logoBg: "bg-blue-600" },
    { symbol: "GBPUSD", name: "GBP / USD", price: "1.26320", change: "+0.0034", changePercent: "+0.27%", isPositive: true, category: "Forex", logoText: "£", logoBg: "bg-purple-600" },
  ]);

  const filteredAssets = assets.filter((asset) => asset.category === activeTab);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0a0b0d] border border-zinc-800 rounded-2xl overflow-hidden p-4 font-sans select-none text-white shadow-2xl">
      
      {/* Header Operator Title Row */}
      <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs text-white">𝖥</div>
          <span className="text-xs font-bold text-zinc-300">Rosa Hernandez</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-extrabold px-1 py-0.5 rounded-full">✓</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">Live Server Connected</span>
      </div>

      {/* 1. TOP TICKER RUNNING METRIC STRIP */}
      <div className="flex items-center gap-2 overflow-x-auto bg-black/40 border border-zinc-900 rounded-lg p-2 mb-4 text-[11px] font-mono whitespace-nowrap scrollbar-none">
        <span className="text-zinc-500">🔥 S&P:</span>
        <span className="text-emerald-400">7,577.9 (+0.09%)</span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-500">🇺🇸 US 100:</span>
        <span className="text-sky-400">30,326.2 (+0.30%)</span>
      </div>

      {/* 2. AVAILABLE BALANCE OVERVIEW FRAME */}
      <div className="bg-[#121317] border border-zinc-900 rounded-xl p-4 text-center relative mb-4">
        <span className="block text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Available Balance</span>
        <span className="text-2xl font-black text-white mt-1 block">$0.00</span>
        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block mt-0.5">Non-Spendable</span>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-zinc-900/80 pt-3 mt-3 text-left text-[11px] text-zinc-400">
          <div className="flex justify-between"><span>Active Deposit</span><span className="text-white font-mono">$0.00</span></div>
          <div className="flex justify-between"><span>Total Earnings</span><span className="text-white font-mono">$0.00</span></div>
          <div className="flex justify-between"><span>Total Withdrawal</span><span className="text-white font-mono">$0.00</span></div>
          <div className="flex justify-between"><span>Account Status</span><span className="text-emerald-400 font-bold">Verified</span></div>
        </div>
      </div>

      {/* 3. VISUAL SIGNAL STRENGTH TRACKER BAR */}
      <div className="bg-[#121317] border border-zinc-900 rounded-xl p-3 mb-4">
        <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-2">Signal Strength Parameters</span>
        <div className="flex gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flex-1 h-3 rounded-sm transition-all duration-300 ${i < 7 ? "bg-gradient-to-t from-rose-600 to-rose-500 shadow-sm shadow-rose-600/20" : "bg-zinc-800"}`} />
          ))}
        </div>
      </div>

      {/* 4. REAL-TIME PROFIT PROGRESS CALCULATOR */}
      <div className="bg-[#121317] border border-zinc-900 rounded-xl p-3 mb-4">
        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-400 mb-2">
          <span>Trade Progress Matrix</span>
          <span className="text-emerald-400 font-mono">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300" />
        </div>
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1.5">
          <span>+0.00% Alpha Margin</span>
          <span className="text-rose-500">-0.00% Risk</span>
        </div>
      </div>

      {/* 5. MULTI-ASSET SEGMENT SELECTOR LOG TABS */}
      <div className="flex bg-black/50 border border-zinc-900 p-1 rounded-xl mb-3 justify-between text-[11px] font-bold">
        {(["Indices", "Futures", "Bonds", "Forex"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-center transition ${activeTab === tab ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 6. LIVE WATCHLIST RENDERING MATRIX */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-none">
        {filteredAssets.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between p-2.5 bg-[#121317]/40 hover:bg-[#121317]/80 border border-zinc-950 hover:border-zinc-900 rounded-xl transition duration-150">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${asset.logoBg} rounded-full flex items-center justify-center font-black text-xs text-white`}>
                {asset.logoText}
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide text-white">{asset.symbol}</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">{asset.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-white block">{asset.price}</span>
              <span className={`text-[10px] font-mono font-bold mt-0.5 inline-block ${asset.isPositive ? "text-emerald-400" : "text-rose-500"}`}>
                {asset.change} ({asset.changePercent})
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}