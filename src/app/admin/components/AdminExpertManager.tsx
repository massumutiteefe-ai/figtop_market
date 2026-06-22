"use client";

import React, { useState, useEffect } from "react";

interface ExpertTrader {
  id: string;
  name: string;
  avatar: string;
  roi: string;
  winRate: string;
  copiers: number;
  riskScore: string;
  specialty: string;
  isVerified?: boolean;
}

export default function AdminExpertManager() {
  const [profiles, setProfiles] = useState<ExpertTrader[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for profile tweaks
  const [roi, setRoi] = useState("");
  const [winRate, setWinRate] = useState("");
  const [copiers, setCopiers] = useState<number>(0);
  const [riskScore, setRiskScore] = useState("Medium");

  useEffect(() => {
    const cached = localStorage.getItem("local_expert_profiles");
    if (cached) {
      setProfiles(JSON.parse(cached));
    }
  }, []);

  const syncToStorage = (updatedList: ExpertTrader[]) => {
    setProfiles(updatedList);
    localStorage.setItem("local_expert_profiles", JSON.stringify(updatedList));
  };

  const startEditing = (profile: ExpertTrader) => {
    setEditingId(profile.id);
    setRoi(profile.roi);
    setWinRate(profile.winRate);
    setCopiers(profile.copiers);
    setRiskScore(profile.riskScore);
  };

  const handleUpdateMetrics = (id: string) => {
    const updated = profiles.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          roi: roi.startsWith("+") || roi.startsWith("-") ? roi : `+${roi}`,
          winRate: winRate.includes("%") ? winRate : `${winRate}%`,
          copiers: Number(copiers),
          riskScore: riskScore,
        };
      }
      return p;
    });
    syncToStorage(updated);
    setEditingId(null);
    alert("Metrics updated successfully!");
  };

  const handleToggleVerification = (id: string) => {
    const updated = profiles.map((p) => {
      if (p.id === id) {
        const nextState = !p.isVerified;
        if (nextState) {
          localStorage.removeItem(`verify_req_${id}`);
        }
        return { ...p, isVerified: nextState };
      }
      return p;
    });
    syncToStorage(updated);
  };

  return (
    <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 mt-6">
      <div className="mb-6 border-b border-gray-800/60 pb-4">
        <h3 className="text-base font-bold text-white">Expert Copy Traders Management</h3>
        <p className="text-xs text-gray-500 mt-0.5">Control expert metrics, change followers, or approve blue verification badges.</p>
      </div>

      <div className="space-y-4">
        {profiles.length === 0 ? (
          <div className="text-center text-xs text-gray-500 py-8 border border-dashed border-gray-800 rounded-xl">
            No registered expert profile profiles found.
          </div>
        ) : (
          profiles.map((trader) => {
            const hasRequestedVerification = localStorage.getItem(`verify_req_${trader.id}`) === "true";
            const isEditingThis = editingId === trader.id;

            return (
              <div 
                key={trader.id}
                className={`bg-[#12131a] border rounded-xl p-5 transition-all ${
                  hasRequestedVerification && !trader.isVerified 
                    ? "border-amber-500/40 bg-amber-500/[0.02]" 
                    : "border-gray-800/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-[200px]">
                    <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                      {trader.avatar.startsWith("data:image") ? (
                        <img src={trader.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        trader.avatar
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white truncate">{trader.name}</span>
                        {trader.isVerified && (
                          <span className="text-[8px] bg-blue-600 text-white font-black px-1.5 py-0.5 rounded-full">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{trader.specialty}</p>
                      
                      {hasRequestedVerification && !trader.isVerified && (
                        <span className="inline-block mt-1.5 text-[8px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                          ⚠️ Requested Blue Tick
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditingThis ? (
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-950/60 p-3 border border-gray-900 rounded-xl">
                      <div>
                        <label className="block text-[8px] text-gray-500 font-bold uppercase mb-0.5">ROI</label>
                        <input type="text" value={roi} onChange={(e) => setRoi(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 rounded p-1 text-xs text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-gray-500 font-bold uppercase mb-0.5">Win Rate</label>
                        <input type="text" value={winRate} onChange={(e) => setWinRate(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 rounded p-1 text-xs text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-gray-500 font-bold uppercase mb-0.5">Followers</label>
                        <input type="number" value={copiers} onChange={(e) => setCopiers(Number(e.target.value))} className="w-full bg-[#12131a] border border-gray-800 rounded p-1 text-xs text-white outline-none" />
                      </div>
                      <div>
                        <label className="block text-[8px] text-gray-500 font-bold uppercase mb-0.5">Risk</label>
                        <select value={riskScore} onChange={(e) => setRiskScore(e.target.value)} className="w-full bg-[#12131a] border border-gray-800 rounded p-1 text-xs text-white outline-none">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 grid grid-cols-4 gap-1.5 text-center text-[11px]">
                      <div className="bg-gray-950/40 p-1.5 rounded border border-gray-900/60">
                        <span className="block text-[8px] text-gray-500 uppercase font-medium">ROI</span>
                        <span className="text-emerald-400 font-bold">{trader.roi}</span>
                      </div>
                      <div className="bg-gray-950/40 p-1.5 rounded border border-gray-900/60">
                        <span className="block text-[8px] text-gray-500 uppercase font-medium">Win Rate</span>
                        <span className="text-blue-400 font-bold">{trader.winRate}</span>
                      </div>
                      <div className="bg-gray-950/40 p-1.5 rounded border border-gray-900/60">
                        <span className="block text-[8px] text-gray-500 uppercase font-medium">Followers</span>
                        <span className="text-gray-300 font-mono font-bold">{trader.copiers}</span>
                      </div>
                      <div className="bg-gray-950/40 p-1.5 rounded border border-gray-900/60">
                        <span className="block text-[8px] text-gray-500 uppercase font-medium">Risk</span>
                        <span className={`font-bold ${trader.riskScore === "Low" ? "text-emerald-500" : trader.riskScore === "Medium" ? "text-amber-500" : "text-rose-500"}`}>{trader.riskScore}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 self-end lg:self-auto">
                    {isEditingThis ? (
                      <>
                        <button onClick={() => handleUpdateMetrics(trader.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded text-[11px]">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-800 text-gray-400 py-1 px-2 rounded text-[11px]">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(trader)} className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium py-1 px-2.5 rounded text-[11px]">Edit</button>
                        <button 
                          onClick={() => handleToggleVerification(trader.id)} 
                          className={`font-bold py-1 px-2.5 rounded text-[11px] ${trader.isVerified ? "bg-rose-950/30 border border-rose-900/40 text-rose-400" : "bg-blue-600 text-white"}`}
                        >
                          {trader.isVerified ? "Revoke" : "Verify"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}