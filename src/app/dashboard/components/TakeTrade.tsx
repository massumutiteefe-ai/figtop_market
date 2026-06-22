"use client";

import React, { useState, useEffect, useMemo } from "react";

/**
 * ==========================================
 * TYPES & INTERFACES (System Specifications)
 * ==========================================
 */
interface SimulatedAsset {
  symbol: string;
  name: string;
  category: "Forex" | "Crypto" | "Commodity";
  currentPrice: number;
  spread: number;
  volatility: number;
  speed: "Slow" | "Medium" | "Fast";
  direction: "Bullish" | "Bearish" | "Sideways";
  adminMode: "Normal" | "ForceProfit" | "ForceLoss";
  contractSize: number;
}

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

export default function TakeTrade() {
  // --- Structural States ---
  const [assets, setAssets] = useState<Record<string, SimulatedAsset>>({});
  const [customPair, setCustomPair] = useState<string>("EURUSD");
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<ClosedTrade[]>([]);

  // --- Real Client Database Synced Accounting Variables ---
  const [baseBalance, setBaseBalance] = useState<number>(() => {
    if (typeof window !== "undefined" && (window as any).currentClientWalletBalance) {
      return Number((window as any).currentClientWalletBalance);
    }
    return 8747.11;
  });

  // --- Order Form Tickets State Deck ---
  const [manualPrice, setManualPrice] = useState<string>("");
  const [lot, setLot] = useState<string>("1.00");
  const [slInput, setSlInput] = useState<string>("");
  const [tpInput, setTpInput] = useState<string>("");

  // --- Inline Workspace Modal Editors for Active Positions ---
  const [editingPosId, setEditingPosId] = useState<string | null>(null);
  const [editSl, setEditSl] = useState<string>("");
  const [editTp, setEditTp] = useState<string>("");

  const SUGGESTED_PAIRS = ["EURUSD", "GBPUSD", "XAUUSD", "BTCUSD", "NAS100", "US30"];

  /**
   * ==========================================
   * BACKEND BROKER DB SYNCHRONIZATION ENGINE
   * ==========================================
   */
  useEffect(() => {
    const syncWithBrokerCore = () => {
      if ((window as any).currentClientWalletBalance) {
        setBaseBalance(Number((window as any).currentClientWalletBalance));
      }
      const storedPositions = localStorage.getItem("ftm_positions_state");
      if (storedPositions) setPositions(JSON.parse(storedPositions));

      const storedMarket = localStorage.getItem("ftm_simulated_market_state");
      if (storedMarket) setAssets(JSON.parse(storedMarket));

      const storedHistory = localStorage.getItem("ftm_trades_history_archive");
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    };

    syncWithBrokerCore();
    window.addEventListener("storage", syncWithBrokerCore);
    return () => window.removeEventListener("storage", syncWithBrokerCore);
  }, []);

  /**
   * ==========================================
   * LIVE BROKER MARKET INTERFERENCE TICK ENGINE (AUTO-TARGET LIQUIDATION)
   * ==========================================
   */
  useEffect(() => {
    const marketSimulationInterval = setInterval(() => {
      let balanceNeedsUpdating = false;
      let nextBalanceValue = baseBalance;
      const positionsToArchive: Position[] = [];

      setPositions((prevPositions) => {
        if (prevPositions.length === 0) return prevPositions;

        let positionsAltered = false;
        
        const updatedPositions = prevPositions.map((pos) => {
          if (pos.status !== "OPEN") return pos;

          let adminProfile = { targetProfitLoss: "", speed: "Medium", trendBias: "Sideways" };
          const storedProfile = localStorage.getItem(`admin_ctrl_node_${pos.id}`);
          if (storedProfile) {
            adminProfile = JSON.parse(storedProfile);
          }

          let velocityMultiplier = 1;
          if (adminProfile.speed === "Slow") velocityMultiplier = 0.4;
          if (adminProfile.speed === "Fast") velocityMultiplier = 2.5;

          const assetSymbol = pos.symbol.toUpperCase();
          const isIndicesOrCrypto = assetSymbol.includes("USDz") || assetSymbol.includes("30") || assetSymbol.includes("100") || assetSymbol.includes("BTC");
          const pointSize = isIndicesOrCrypto ? 0.1 : 0.00005;

          const zigzagFluctuation = (Math.random() - 0.5) * pointSize * 2 * velocityMultiplier;
          let trendBiasShift = 0;

          if (adminProfile.trendBias === "MatchDirection") {
            trendBiasShift = pos.type === "BUY" ? (pointSize * 0.3 * velocityMultiplier) : (-pointSize * 0.3 * velocityMultiplier);
          } else if (adminProfile.trendBias === "OpposeDirection") {
            trendBiasShift = pos.type === "BUY" ? (-pointSize * 0.3 * velocityMultiplier) : (pointSize * 0.3 * velocityMultiplier);
          }

          const contractSize = isIndicesOrCrypto ? 10 : 100000;
          const positionTickProfitChange = (trendBiasShift + zigzagFluctuation) * pos.lot * contractSize;
          let simulatedNextProfit = pos.profit + positionTickProfitChange;

          // 🌟 AUTOMATIC TARGET LIQUIDATION DETECTION TRIGGER
          const targetCap = adminProfile.targetProfitLoss ? parseFloat(adminProfile.targetProfitLoss) : null;
          if (targetCap !== null) {
            const hitPositiveTarget = targetCap >= 0 && simulatedNextProfit >= targetCap;
            const hitNegativeTarget = targetCap < 0 && simulatedNextProfit <= targetCap;

            if (hitPositiveTarget || hitNegativeTarget) {
              pos.profit = targetCap;
              pos.status = "CLOSED";
              
              nextBalanceValue += targetCap;
              balanceNeedsUpdating = true;
              positionsToArchive.push(pos);
              
              localStorage.removeItem(`admin_ctrl_node_${pos.id}`);
              positionsAltered = true;
              return null;
            }
          }

          positionsAltered = true;
          return { ...pos, profit: simulatedNextProfit };
        }).filter(Boolean) as Position[];

        if (positionsAltered) {
          localStorage.setItem("ftm_positions_state", JSON.stringify(updatedPositions));
          return updatedPositions;
        }
        return prevPositions;
      });

      // Execute real financial balance settlements and record archival histories
      if (balanceNeedsUpdating && positionsToArchive.length > 0) {
        setBaseBalance(nextBalanceValue);
        (window as any).currentClientWalletBalance = nextBalanceValue;
        localStorage.setItem("ftm_client_db_balance", nextBalanceValue.toFixed(2));

        const updatedHistory = [...history];
        positionsToArchive.forEach((closedPos) => {
          const assetKey = closedPos.symbol.toUpperCase();
          const closingAssetSpot = assets[assetKey]?.currentPrice || closedPos.entry;

          const archiveRecord: ClosedTrade = {
            ...closedPos,
            closePrice: closingAssetSpot,
            closeTime: new Date().toISOString().replace("T", " ").substring(0, 19),
          };
          updatedHistory.unshift(archiveRecord);
        });

        setHistory(updatedHistory);
        localStorage.setItem("ftm_trades_history_archive", JSON.stringify(updatedHistory));
        window.dispatchEvent(new Event("storage"));
      }

      // Synchronize simulated asset price metrics
      setAssets((prevAssets) => {
        const nextAssets = { ...prevAssets };
        let assetsMutated = false;

        positions.forEach((pos) => {
          if (pos.status !== "OPEN") return;
          const assetKey = pos.symbol.toUpperCase();
          const isIndicesOrCrypto = assetKey.includes("USDz") || assetKey.includes("30") || assetKey.includes("100") || assetKey.includes("BTC");
          const contractSize = isIndicesOrCrypto ? 10 : 100000;
          const multiplier = pos.type === "BUY" ? 1 : -1;
          const currentComputedSpot = pos.entry + (pos.profit / (pos.lot * contractSize)) * multiplier;

          if (!nextAssets[assetKey] || nextAssets[assetKey].currentPrice !== currentComputedSpot) {
            assetsMutated = true;
            nextAssets[assetKey] = {
              symbol: assetKey,
              name: assetKey,
              category: isIndicesOrCrypto ? "Crypto" : "Forex",
              currentPrice: currentComputedSpot,
              spread: 0.0002,
              volatility: 5,
              speed: "Medium",
              direction: "Sideways",
              adminMode: "Normal",
              contractSize: contractSize
            };
          }
        });

        if (assetsMutated) {
          localStorage.setItem("ftm_simulated_market_state", JSON.stringify(nextAssets));
          return nextAssets;
        }
        return prevAssets;
      });
    }, 300);

    return () => clearInterval(marketSimulationInterval);
  }, [positions, baseBalance, history, assets]);

  // Aggregate Real-time Pipeline Financial Metrics
  const totalFloatingPnL = useMemo(() => {
    return positions.reduce((acc, pos) => acc + (pos.status === "OPEN" ? pos.profit : 0), 0);
  }, [positions]);

  const equity = baseBalance + totalFloatingPnL;
  const activeTradesCount = positions.filter((p) => p.status === "OPEN").length;

  useEffect(() => {
    const updateEvent = new CustomEvent("updateLivePortfolioTotal", { detail: totalFloatingPnL });
    window.dispatchEvent(updateEvent);
  }, [totalFloatingPnL]);

  // --- Trade Action Closures ---
  const handleManualCloseTrade = (id: string) => {
    const targetPosition = positions.find((p) => p.id === id);
    if (!targetPosition) return;

    const remainingPositions = positions.filter((p) => p.id !== id);
    setPositions(remainingPositions);
    localStorage.setItem("ftm_positions_state", JSON.stringify(remainingPositions));

    const finalRealizedBalance = baseBalance + targetPosition.profit;
    (window as any).currentClientWalletBalance = finalRealizedBalance;
    setBaseBalance(finalRealizedBalance);

    const assetKey = targetPosition.symbol.toUpperCase();
    const closingAssetSpot = assets[assetKey]?.currentPrice || targetPosition.entry;
    
    const archiveRecord: ClosedTrade = {
      ...targetPosition,
      status: "CLOSED",
      closePrice: closingAssetSpot,
      closeTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updatedHistory = [archiveRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("ftm_trades_history_archive", JSON.stringify(updatedHistory));

    window.dispatchEvent(new Event("storage"));
  };

  const handleOpenEditor = (pos: Position) => {
    setEditingPosId(pos.id);
    setEditSl(pos.sl ? pos.sl.toString() : "");
    setEditTp(pos.tp ? pos.tp.toString() : "");
  };

  const handleSaveModifiedRiskLimits = (id: string) => {
    const updated = positions.map((pos) => {
      if (pos.id === id) {
        return {
          ...pos,
          sl: editSl ? parseFloat(editSl) : null,
          tp: editTp ? parseFloat(editTp) : null,
        };
      }
      return pos;
    });
    setPositions(updated);
    localStorage.setItem("ftm_positions_state", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    setEditingPosId(null);
  };

  const handleOpenTradeTicket = (type: "BUY" | "SELL") => {
    const formattedSymbol = customPair.toUpperCase().trim();
    if (!formattedSymbol) return;

    const currentAssetSpot = assets[formattedSymbol]?.currentPrice || 1.0000;
    const strikeEntryPrice = manualPrice ? parseFloat(manualPrice) : currentAssetSpot;

    const newPosition: Position = {
      id: Math.floor(100000000 + Math.random() * 900000000).toString(),
      symbol: formattedSymbol,
      type,
      lot: parseFloat(lot) || 1.00,
      entry: strikeEntryPrice,
      sl: slInput ? parseFloat(slInput) : null,
      tp: tpInput ? parseFloat(tpInput) : null,
      profit: 0,
      status: "OPEN",
      openTime: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updatedPositions = [newPosition, ...positions];
    setPositions(updatedPositions);
    localStorage.setItem("ftm_positions_state", JSON.stringify(updatedPositions));
    window.dispatchEvent(new Event("storage"));

    setManualPrice("");
    setSlInput("");
    setTpInput("");
  };

  return (
    <div className="p-6 bg-[#0b0f1a] text-gray-200 min-h-screen font-sans space-y-6">
      
      {/* Account Overview Grid Panel Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#111827] p-4 rounded-xl border border-gray-800">
        <div>
          <p className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Base Balance</p>
          <p className="text-xl font-bold font-mono text-emerald-400">${baseBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Account Equity</p>
          <p className="text-xl font-bold font-mono text-blue-400">${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Floating P/L</p>
          <p className={`text-xl font-bold font-mono ${totalFloatingPnL >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
            {totalFloatingPnL >= 0 ? "+" : ""}${totalFloatingPnL.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Open Pipelines</p>
          <p className="text-xl font-bold font-mono text-amber-500">{activeTradesCount} Active</p>
        </div>
      </div>

      {/* Main Trading Terminal Block System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Execution Ticket & Field Set Matrix */}
        <div className="bg-[#111827] p-5 rounded-xl border border-gray-800 space-y-4 h-fit">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2">
            Execution Order Ticket
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase font-bold text-gray-500 block mb-1">Asset Pair Symbol</label>
              <input
                type="text"
                value={customPair}
                onChange={(e) => setCustomPair(e.target.value.toUpperCase())}
                placeholder="e.g. EURUSD"
                className="w-full bg-[#1f2937] text-sm text-white font-bold tracking-wide border border-gray-700 rounded p-2.5 outline-none focus:border-indigo-500"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_PAIRS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCustomPair(p)}
                    className={`text-[10px] px-2 py-1 rounded font-mono font-bold border transition ${
                      customPair === p ? "bg-indigo-600 border-indigo-500 text-white" : "bg-[#161b26] border-gray-800 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 block mb-1">Entry Price (Blank=Spot)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                  placeholder="Market Execution"
                  className="w-full bg-[#1f2937] text-xs text-gray-300 border border-gray-700 rounded p-2 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 block mb-1">Volume Allocation (Lot)</label>
                <input
                  type="number"
                  step="0.01"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  className="w-full bg-[#1f2937] text-xs font-bold text-white font-mono border border-gray-700 rounded p-2 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 block mb-1">Stop Loss (SL)</label>
                <input
                  type="number"
                  step="0.00001"
                  placeholder="None"
                  value={slInput}
                  onChange={(e) => setSlInput(e.target.value)}
                  className="w-full bg-[#1f2937] text-xs border border-gray-700 rounded p-2 outline-none focus:border-rose-600"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase font-bold text-gray-500 block mb-1">Take Profit (TP)</label>
                <input
                  type="number"
                  step="0.00001"
                  placeholder="None"
                  value={tpInput}
                  onChange={(e) => setTpInput(e.target.value)}
                  className="w-full bg-[#1f2937] text-xs border border-gray-700 rounded p-2 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <button
                onClick={() => handleOpenTradeTicket("BUY")}
                className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition font-bold py-3 rounded text-xs text-white uppercase tracking-wider shadow-md"
              >
                BUY / LONG
              </button>
              <button
                onClick={() => handleOpenTradeTicket("SELL")}
                className="bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition font-bold py-3 rounded text-xs text-white uppercase tracking-wider shadow-md"
              >
                SELL / SHORT
              </button>
            </div>
          </div>
        </div>

        {/* Right Active Pipeline MT4 System Display Cards */}
      <div className="lg:col-span-2 bg-[#111827] p-5 rounded-xl border border-gray-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2">
          Active MT4 Pipeline Positions
        </h2>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {positions.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 border border-gray-800 border-dashed rounded-xl bg-[#0b0f1a]">
              No operational running positions detected in account terminal memory.
            </div>
          ) : (
            positions.map((pos) => {
              const liveSpotValuation = assets[pos.symbol]?.currentPrice || pos.entry;
              return (
                <div key={pos.id} className="bg-[#0b0f1a] border border-gray-800 p-4 rounded-xl space-y-3 transition hover:border-gray-700">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white tracking-wide">{pos.symbol}</span>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          pos.type === "BUY" ? "bg-emerald-950/80 text-emerald-400" : "bg-rose-950/80 text-rose-400"
                        }`}>
                          {pos.type.toLowerCase()} {pos.lot.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-gray-600 mt-0.5">Ticket: #{pos.id}</p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-base font-bold font-mono ${pos.profit >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                        ${pos.profit.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-[11px] font-mono border-t border-gray-900 pt-2.5">
                    <div>
                      <span className="text-gray-500">S / L:</span>{" "}
                      <span className="text-gray-300">{pos.sl ? pos.sl.toFixed(5) : "0.00000"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Entry Strike:</span>{" "}
                      <span className="text-gray-400">{pos.entry.toFixed(5)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Open Time:</span>{" "}
                      <span className="text-gray-400 text-[10px]">{pos.openTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">T / P:</span>{" "}
                      <span className="text-gray-300">{pos.tp ? pos.tp.toFixed(5) : "0.00000"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Spot:</span>{" "}
                      <span className="text-blue-400 font-bold">{liveSpotValuation.toFixed(5)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Swap Charge:</span>{" "}
                      <span className="text-gray-400">0.00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 border-t border-gray-900/50 pt-2 text-xs">
                    {editingPosId === pos.id ? (
                      <div className="flex items-center space-x-1.5 bg-[#111827] p-1.5 rounded border border-gray-800 w-full justify-between">
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            placeholder="New SL"
                            value={editSl}
                            onChange={(e) => setEditSl(e.target.value)}
                            className="bg-[#1f2937] text-[11px] border border-gray-700 rounded p-1 w-20 outline-none text-white"
                          />
                          <input
                            type="number"
                            placeholder="New TP"
                            value={editTp}
                            onChange={(e) => setEditTp(e.target.value)}
                            className="bg-[#1f2937] text-[11px] border border-gray-700 rounded p-1 w-20 outline-none text-white"
                          />
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleSaveModifiedRiskLimits(pos.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded text-[10px] font-bold text-white transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPosId(null)}
                            className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-[10px] text-gray-300 transition"
                          >
                            Exit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleOpenEditor(pos)}
                          className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 px-2.5 py-1 rounded font-medium text-[11px] transition"
                        >
                          Modify Risk (SL/TP)
                        </button>
                        <button
                          onClick={() => handleManualCloseTrade(pos.id)}
                          className="bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900 text-rose-400 px-3 py-1 rounded font-bold text-[11px] transition"
                        >
                          Close Position
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>

    {/* Closed Archive Ledger (History) */}
    <div className="bg-[#111827] p-5 rounded-xl border border-gray-800">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800 pb-2 mb-3">
        Closed Operational Ledger Archive (History)
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-400">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 font-mono uppercase tracking-wider text-[10px]">
              <th className="py-2.5">Instrument Token</th>
              <th>Type</th>
              <th>Volume Lot</th>
              <th>Strike Entry</th>
              <th>Settlement Close Price</th>
              <th>Execution Open Time</th>
              <th>Liquidation Close Time</th>
              <th className="text-right">Realized Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/40">
            {history.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500 font-sans">No settled entries found inside database archives.</td>
              </tr>
            ) : (
              history.map((record, index) => (
                <tr key={index} className="hover:bg-[#0b0f1a]/30 font-mono text-[11px]">
                  <td className="py-3 font-sans font-bold text-white">{record.symbol}</td>
                  <td>
                    <span className={`px-1 py-0.5 rounded text-[10px] font-bold ${record.type === "BUY" ? "text-emerald-400 bg-emerald-950/30" : "text-rose-400 bg-rose-950/30"}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>{record.lot.toFixed(2)}</td>
                  <td>{record.entry.toFixed(5)}</td>
                  <td className="text-blue-400 font-bold">{record.closePrice.toFixed(5)}</td>
                  <td className="text-[10px] text-gray-500">{record.openTime}</td>
                  <td className="text-[10px] text-gray-500">{record.closeTime}</td>
                  <td className={`text-right font-bold text-sm ${record.profit >= 0 ? "text-emerald-400" : "text-rose-500"}`}>
                    {record.profit >= 0 ? "+" : ""}{record.profit.toFixed(2)}
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