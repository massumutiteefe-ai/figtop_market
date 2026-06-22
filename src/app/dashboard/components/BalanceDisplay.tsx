"use client";

import React, { useState, useEffect } from "react";

interface BalanceDisplayProps {
  onActionClick: (action: "deposit" | "invest" | "history" | "withdraw") => void;
  liveBalance: string;
}

export default function BalanceDisplay({ onActionClick, liveBalance }: BalanceDisplayProps) {
  // 🌟 REAL-TIME COMPREHENSIVE AUTO-COMPOUNDING HOOK MATRIX
  const [runningYieldTotal, setRunningYieldTotal] = useState<number>(0);

  useEffect(() => {
    // Expose current static cash balance to the window global tree for verification gates
    (window as any).currentClientWalletBalance = Number(liveBalance);

    const handleBalanceUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const calculatedYield = Number(customEvent.detail);
      setRunningYieldTotal(calculatedYield);
      
      // Keep exposed allocation boundary parameters fully synced down to terminal modules
      (window as any).currentClientWalletBalance = Number(liveBalance) + calculatedYield;
    };
    
    window.addEventListener('updateLivePortfolioTotal', handleBalanceUpdate);
    return () => window.removeEventListener('updateLivePortfolioTotal', handleBalanceUpdate);
  }, [liveBalance]);

  // 🌟 RE-CALCULATE ACCUMULATIVE VALUE: Adds live active trade values to the wallet balance
  const aggregatedAccountValue = Number(liveBalance) + runningYieldTotal;

  const formattedCash = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(aggregatedAccountValue);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 rounded-xl shadow-xl space-y-6 select-none animate-fadeIn">
      <div className="text-center py-4 border-b border-slate-700/50">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Account Value</p>
        <h2 className="text-3xl font-black text-emerald-400 font-mono mt-1 tracking-tight">{formattedCash}</h2>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Available Portfolio Liquidity + Compounding Open Positions</p>
      </div>

      {/* RE-LINKED OPERATION ROUTING ACTION FLOOR BAR (INVEST REMOVED - ADJUSTED TO 3 COLS) */}
      <div className="grid grid-cols-3 gap-3">
        
        {/* BUTTON 1: DEPOSIT */}
        <button 
          onClick={() => onActionClick("deposit")} 
          className="flex flex-col items-center gap-1.5 p-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-lg text-slate-200 transition-all duration-150 cursor-pointer"
        >
          <span className="text-lg">📥</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Deposit</span>
        </button>
        
        {/* BUTTON 2: WITHDRAW */}
        <button 
          onClick={() => onActionClick("withdraw")} 
          className="flex flex-col items-center gap-1.5 p-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-rose-500 rounded-lg text-slate-200 transition-all duration-150 cursor-pointer"
        >
          <span className="text-lg">📤</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Withdraw</span>
        </button>
        
        {/* BUTTON 3: DETAILS */}
        <button 
          onClick={() => onActionClick("history")} 
          className="flex flex-col items-center gap-1.5 p-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg text-slate-200 transition-all duration-150 cursor-pointer"
        >
          <span className="text-lg">📋</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Details</span>
        </button>

      </div>
    </div>
  );
}