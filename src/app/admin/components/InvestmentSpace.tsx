'use strict';

import React, { useEffect, useState } from 'react';

interface ActivePosition {
  id: number;
  client: string;
  asset: string;
  margin: number;
  customPercent: number | string;
}

export default function InvestmentSpace() {
  const [positions, setPositions] = useState<ActivePosition[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<ActivePosition | null>(null);
  
  // Input control states
  const [percentInput, setPercentInput] = useState<string>("");
  const [partialCloseInput, setPartialCloseInput] = useState<string>("");
  const [fullClosePayout, setFullClosePayout] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadPositions = async () => {
    try {
      const res = await fetch('https://onrender.comadmin_get_positions.php');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPositions(data);
      }
    } catch (err) {
      console.error("Failed to load operational trades ledger records:", err);
    }
  };

  useEffect(() => {
    loadPositions();
    const interval = setInterval(loadPositions, 5000);
    return () => clearInterval(interval);
  }, []);

  const openAuditPanel = (pos: ActivePosition) => {
    setSelectedAudit(pos);
    setPercentInput(pos.customPercent.toString());
    setPartialCloseInput("");
    setFullClosePayout(pos.margin.toString()); // Default payout estimation matches principal margin
  };

  // 1. Submit Outcome percentage change parameters
  const updatePercentOverride = async () => {
    if (!selectedAudit) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("action", "update_percent");
      formData.append("position_id", selectedAudit.id.toString());
      formData.append("percent", percentInput);

      const res = await fetch('https://onrender.comadmin_modify_trade.php', { method: "POST", body: formData });
      const r = await res.json();
      if (r.status === "success") {
        alert("Outcome percentage yield override committed successfully!");
        loadPositions();
        setSelectedAudit(null);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // 2. Submit Partial Close variables parameters
  const submitPartialClose = async () => {
    if (!selectedAudit || !partialCloseInput) return;
    if (Number(partialCloseInput) >= selectedAudit.margin) return alert("Deduction value cannot exceed entire contract margin limit.");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("action", "close_partial");
      formData.append("position_id", selectedAudit.id.toString());
      formData.append("reduce_amount", partialCloseInput);

      const res = await fetch('https://onrender.comadmin_modify_trade.php', { method: "POST", body: formData });
      const r = await res.json();
      if (r.status === "success") {
        alert(`Successfully executed partial close: Deducted $${partialCloseInput} from position principal.`);
        loadPositions();
        setSelectedAudit(null);
      } else { alert(r.message); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // 3. Submit Total termination rule configurations
  const submitFullClose = async () => {
    if (!selectedAudit || !fullClosePayout) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("action", "close_full");
      formData.append("position_id", selectedAudit.id.toString());
      formData.append("payout_amount", fullClosePayout);

      const res = await fetch('https://onrender.comadmin_modify_trade.php', { method: "POST", body: formData });
      const r = await res.json();
      if (r.status === "success") {
        alert(`Position contract closed safely. Payout amount of $${fullClosePayout} has been registered.`);
        loadPositions();
        setSelectedAudit(null);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="w-full bg-[#1e293b]/40 border border-slate-700/60 rounded-xl p-5 relative">
      <div className="border-b border-slate-700/50 pb-3 mb-4">
        <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">POSITION DIRECTION & YIELD CONTROLLER</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Control individual trade parameters, set specific percentages, execute partial closures, or terminate contracts.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
              <th className="pb-3 px-2">Position ID</th>
              <th className="pb-3">Client Profile</th>
              <th className="pb-3">Target Asset</th>
              <th className="pb-3">Margin Value</th>
              <th className="pb-3">Type</th>
              {/* 🌟 NEW HEADER COLUMN ADDED DIRECTLY WHERE YOUR CURSOR WAS POINTING */}
              <th className="pb-3 text-center">Outcome % Override</th>
              <th className="pb-3 text-right pr-4">Action Parameters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-300">
            {positions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 font-mono text-slate-500 text-[11px]">No active running client positions found.</td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-800/20 transition duration-150 font-medium">
                  <td className="py-3.5 px-2 font-mono text-slate-500">#POS-{pos.id}</td>
                  <td className="py-3.5 font-bold text-slate-200 truncate max-w-[110px]">{pos.client}</td>
                  <td className="py-3.5 font-mono text-orange-400 text-xs font-black">{pos.asset}</td>
                  <td className="py-3.5 font-mono text-emerald-400 font-semibold">${pos.margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${pos.asset.includes('BOT') ? 'bg-purple-950 text-purple-400' : 'bg-blue-950 text-blue-400'}`}>{pos.asset.includes('BOT') ? 'AI Bot' : 'Spot'}</span>
                  </td>
                  {/* 🌟 OUTPUT LAYER VALUE DISPLAY DATA CONTAINER ROW ELEMENT */}
                  <td className="py-3.5 text-center font-mono font-bold text-amber-400 text-xs">
                    {pos.customPercent !== "" ? `${pos.customPercent}%` : <span className="text-slate-600 font-normal italic text-[11px]">System Default</span>}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button onClick={() => openAuditPanel(pos)} className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded transition shadow-md">Modify Trade</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 RE-ENGINEERED COMPREHENSIVE MODIFICATION MODAL WINDOW */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 max-w-md w-full text-slate-100 shadow-2xl space-y-5">
            <div className="border-b border-slate-700 pb-2">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wide">Advanced Trade Modifier</h3>
              <p className="text-xs text-slate-400">Executing precise adjustments over contract: <span className="font-mono text-orange-400 font-bold">#POS-{selectedAudit.id}</span></p>
            </div>

            {/* SECTION A: MODIFY RUNNING PERCENTAGE OVERRIDE */}
            <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/50 space-y-2.5">
              <label className="block text-[10px] font-bold uppercase font-mono text-amber-400 tracking-wider">1. Set Custom Outcome Percentage</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 15.5 or -8.2 (Leave blank for default)" 
                  value={percentInput} 
                  onChange={(e) => setPercentInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button onClick={updatePercentOverride} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 rounded transition">Apply %</button>
              </div>
            </div>

            {/* SECTION B: EXECUTE PARTIAL CLOSE RULES */}
            <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/50 space-y-2.5">
              <label className="block text-[10px] font-bold uppercase font-mono text-blue-400 tracking-wider">
                2. Partial Close (Deduct Margin Principal)
              </label>
              <p className="text-[10px] text-slate-500">
                Current principal size: <span className="font-bold text-emerald-400">${selectedAudit.margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </p>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Enter capital amount to close out" 
                  value={partialCloseInput} 
                  onChange={(e) => setPartialCloseInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono focus:outline-none focus:border-blue-500 text-white"
                />
                <button 
                  onClick={submitPartialClose} 
                  disabled={loading || !partialCloseInput} 
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold text-xs px-3 rounded transition-all duration-150"
                >
                  Close Partial
                </button>
              </div>
            </div>

            {/* SECTION C: TERMINATE AND CLOSE FULL CONTRACT POSITION */}
            <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-700/50 space-y-2.5">
              <label className="block text-[10px] font-bold uppercase font-mono text-rose-400 tracking-wider">
                3. Complete Trade Contract Termination
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Enter final balance return outcome value" 
                  value={fullClosePayout} 
                  onChange={(e) => setFullClosePayout(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono focus:outline-none focus:border-rose-500 text-white"
                />
                <button 
                  onClick={submitFullClose} 
                  disabled={loading} 
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 rounded transition-all duration-150"
                >
                  Close Trade
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setSelectedAudit(null)} 
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold py-2 rounded-lg transition-all duration-150"
              >
                Dismiss Modifier Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}