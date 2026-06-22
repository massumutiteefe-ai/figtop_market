"use client";

import React, { useState, useEffect } from "react";

/**
 * ==========================================
 * CONTROLLER TYPE ARCHITECTURES
 * ==========================================
 */
interface Position {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  lot: number;
  entry: number;
  sl: number | null;
  tp: number | null;
  profit: number;
  status: "OPEN" | "CLOSED";
  openTime: string;
}

interface ClosedTrade extends Position {
  closePrice: number;
  closeTime: string;
}

// Admin settings appended to individual position instances to allow fine-grain node targeting
interface AdminControlProfile {
  targetProfitLoss: string;     // Target monetary value (e.g. 1000 or -500)
  speed: "Slow" | "Medium" | "Fast";
  trendBias: "MatchDirection" | "OpposeDirection" | "Sideways";
}

export default function FigtopSever() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<ClosedTrade[]>([]);
  const [controls, setControls] = useState<Record<string, AdminControlProfile>>({});

  /**
   * ==========================================
   * PIPELINE BACKEND RECORD SYNCHRONIZER
   * ==========================================
   */
  useEffect(() => {
    const syncServerMemory = () => {
      // 1. Fetch live active trade parameters
      const storedPositions = localStorage.getItem("ftm_positions_state");
      if (storedPositions) {
        const parsedPositions: Position[] = JSON.parse(storedPositions);
        setPositions(parsedPositions);

        // Initialize missing administration profiles for newly initialized nodes
        setControls((prev) => {
          const updated = { ...prev };
          parsedPositions.forEach((pos) => {
            if (!updated[pos.id]) {
              updated[pos.id] = {
                targetProfitLoss: "",
                speed: "Medium",
                trendBias: "Sideways",
              };
            }
          });
          return updated;
        });
      }

      // 2. Fetch completed historic trades
      const storedHistory = localStorage.getItem("ftm_trades_history_archive");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };

    syncServerMemory();
    window.addEventListener("storage", syncServerMemory);
    return () => window.removeEventListener("storage", syncServerMemory);
  }, []);

  // Sync state mutations across windows
  const broadcastPositionsUpdate = (updated: Position[]) => {
    setPositions(updated);
    localStorage.setItem("ftm_positions_state", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  /**
   * ==========================================
   * CONTROL PROFILE MANIPULATION HANDLERS
   * ==========================================
   */
  const handleControlChange = (id: string, key: keyof AdminControlProfile, value: string) => {
    setControls((prev) => {
      const updatedProfile = { ...prev[id], [key]: value };
      const nextControls = { ...prev, [id]: updatedProfile };
      
      // Save configurations down to local browser session mapping for background loops
      localStorage.setItem(`admin_ctrl_node_${id}`, JSON.stringify(updatedProfile));
      return nextControls;
    });
  };

  /**
   * ==========================================
   * SERVER LIQUIDATION FORCE-CLOSE COMMANDS
   * ==========================================
   */
  const handleAdminForceClose = (id: string) => {
    const targetPosition = positions.find((p) => p.id === id);
    if (!targetPosition) return;

    // Remove from active processing loops
    const remainingPositions = positions.filter((p) => p.id !== id);
    localStorage.setItem("ftm_positions_state", JSON.stringify(remainingPositions));
    setPositions(remainingPositions);

    // Grab client base cash value from balance display module engine
    const currentBaseBalance = Number(localStorage.getItem("ftm_client_db_balance") || "10000.00");
    const settledBalance = currentBaseBalance + targetPosition.profit;
    localStorage.setItem("ftm_client_db_balance", settledBalance.toFixed(2));

    // Construct history tracking payload record
    const archiveRecord: ClosedTrade = {
      ...targetPosition,
      status: "CLOSED",
      closePrice: targetPosition.entry + (targetPosition.profit / (targetPosition.lot * 100000)) * (targetPosition.type === "BUY" ? 1 : -1),
      closeTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updatedHistory = [archiveRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("ftm_trades_history_archive", JSON.stringify(updatedHistory));

    // Wipe profile configurations
    localStorage.removeItem(`admin_ctrl_node_${id}`);
    
    // Broadcast total ledger alterations to updating window frames
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="p-6 bg-[#090d16] text-gray-200 min-h-screen font-sans space-y-6">
      
      {/* Top Engine Configuration Status Header Banner */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-amber-500 tracking-wider uppercase font-mono">Figtop Broker Core Server</h1>
          <p className="text-xs text-gray-500">Live Client Pipeline Algorithmic Interference Desk</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-[#111625] px-3 py-1.5 rounded-lg border border-gray-800 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-gray-400">NODE RUNTIME INTERCEPTOR: LINKED</span>
        </div>
      </div>

      {/* Main Panel Operations Desk */}
      <div className="bg-[#111625] p-5 rounded-xl border border-gray-800/80 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2">
          Active Live Operations Interception Pipeline
        </h2>

        <div className="space-y-4">
          {positions.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 border border-gray-800 border-dashed rounded-xl bg-[#090d16]">
              No active client pipelines detected running on current node grid.
            </div>
          ) : (
            positions.map((pos) => {
              const profile = controls[pos.id] || { targetProfitLoss: "", speed: "Medium", trendBias: "Sideways" };
              return (
                <div 
                  key={pos.id} 
                  className="bg-[#090d16] border border-gray-800 p-5 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:border-amber-600/30 transition-all duration-200"
                >
                  
                  {/* METADATA SUMMARY SUB-BLOCK */}
                  <div className="space-y-1 min-w-[200px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-white tracking-wide">{pos.symbol}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        pos.type === "BUY" ? "bg-emerald-950 text-emerald-400" : "bg-rose-950 text-rose-400"
                      }`}>
                        {pos.type} {pos.lot.toFixed(2)} Lot
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      Strike Entry: <span className="text-gray-300 font-bold">{pos.entry.toFixed(5)}</span>
                    </div>
                    <div className="text-[10px] text-gray-600 font-mono">
                      Ticket Hash ID: #{pos.id}
                    </div>
                  </div>

                  {/* LIVE FINANCIAL TELEMETRY */}
                  <div className="bg-[#111625]/60 border border-gray-800/50 rounded-lg p-3 text-center min-w-[140px]">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Live Pipeline PnL</p>
                    <p className={`text-base font-black font-mono mt-0.5 ${pos.profit >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                      {pos.profit >= 0 ? "+" : ""}${pos.profit.toFixed(2)}
                    </p>
                  </div>

                  {/* INTERFERENCE MATRIX INPUT COMMAND CONTROLS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    
                    {/* CONTROL 1: TARGET AMOUNT INJECTION CAP */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Target Value Cap ($)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1000 or -500"
                        value={profile.targetProfitLoss}
                        onChange={(e) => handleControlChange(pos.id, "targetProfitLoss", e.target.value)}
                        className="w-full bg-[#161b26] text-xs font-mono font-bold text-amber-400 rounded border border-gray-700 p-2 outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* CONTROL 2: MANIPULATION SPEED VARIABLE SELECTOR */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Fluctuation Velocity</label>
                      <select
                        value={profile.speed}
                        onChange={(e) => handleControlChange(pos.id, "speed", e.target.value as any)}
                        className="w-full bg-[#161b26] text-xs font-bold text-white rounded border border-gray-700 p-2 outline-none focus:border-amber-500"
                      >
                        <option value="Slow">Slow Zigzag</option>
                        <option value="Medium">Medium Flow</option>
                        <option value="Fast">Fast Tick Velocity</option>
                      </select>
                    </div>

                    {/* CONTROL 3: TREND TRAJECTORY MODE OVERRIDE */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">Trend Direction Override</label>
                      <select
                        value={profile.trendBias}
                        onChange={(e) => handleControlChange(pos.id, "trendBias", e.target.value as any)}
                        className="w-full bg-[#161b26] text-xs font-bold text-white rounded border border-gray-700 p-2 outline-none focus:border-amber-500"
                      >
                        <option value="Sideways">Sideways Fluctuations</option>
                        <option value="MatchDirection">Pump Live Profit ↑</option>
                        <option value="OpposeDirection">Dump Live Loss ↓</option>
                      </select>
                    </div>

                  </div>

                  {/* LIQUIDATION FORCE ACTION TERMINAL TRIGGER */}
                  <div className="flex items-center xl:pt-4">
                    <button
                      onClick={() => handleAdminForceClose(pos.id)}
                      className="w-full xl:w-auto bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-400 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-all duration-150 shadow-md"
                    >
                      Kill Position
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Audit Block Monitoring Archive Log Table */}
      <div className="bg-[#111625] p-5 rounded-xl border border-gray-800/80">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2 mb-3">
          Completed Broker Archival Records (Trade Monitor Log)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-400">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 font-mono uppercase text-[10px] tracking-wider">
                <th className="py-2">Instrument</th>
                <th>Action Direction</th>
                <th>Volume</th>
                <th>Entry Strike</th>
                <th>Exit Settle Price</th>
                <th className="text-right">Settled Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-600 font-sans">No historical liquidation trails saved to registry memory.</td>
                </tr>
              ) : (
                history.slice(0, 10).map((trade, idx) => (
                  <tr key={idx} className="font-mono text-gray-300">
                    <td className="py-2.5 font-sans font-bold text-white">{trade.symbol}</td>
                    <td>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${trade.type === "BUY" ? "text-emerald-400 bg-emerald-950/20" : "text-rose-400 bg-rose-950/20"}`}>
                        {trade.type}
                      </span>
                    </td>
                    <td>{trade.lot.toFixed(2)}</td>
                    <td>{trade.entry.toFixed(5)}</td>
                    <td>{trade.closePrice.toFixed(5)}</td>
                    <td className={`font-bold text-right ${trade.profit >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                      ${trade.profit.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}