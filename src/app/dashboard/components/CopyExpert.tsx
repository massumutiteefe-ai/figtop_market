"use client";

import React, { useState, useEffect } from "react";
import BecomeExpertWizard from "./BecomeExpertWizard";
import ManageExpertProfile from "./ManageExpertProfile";
import PostSignalModal from "./PostSignalModal";

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

export default function CopyExpert() {
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [activeCopies, setActiveCopies] = useState<string[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  const [selectedManageProfile, setSelectedManageProfile] = useState<ExpertTrader | null>(null);
  const [activeSignalTrader, setActiveSignalTrader] = useState<ExpertTrader | null>(null);

  const [topExperts, setTopExperts] = useState<ExpertTrader[]>([
    {
      id: "exp_1",
      name: "Sarah Jenkins (Alpha Wolf)",
      avatar: "📈",
      roi: "+142.8%",
      winRate: "89.4%",
      copiers: 1420,
      riskScore: "Medium",
      specialty: "Crypto Index & Scalping",
      isVerified: true,
    },
    {
      id: "exp_2",
      name: "Marcus Vance (S&P Whale)",
      avatar: "🏛️",
      roi: "+84.3%",
      winRate: "93.1%",
      copiers: 3105,
      riskScore: "Low",
      specialty: "Stocks & Blue Chip Indices",
      isVerified: true,
    },
    {
      id: "exp_3",
      name: "Elena Rostova (Forex Queen)",
      avatar: "⚡",
      roi: "+210.5%",
      winRate: "84.2%",
      copiers: 980,
      riskScore: "High",
      specialty: "EUR/USD & Gold Volatility",
      isVerified: false,
    },
  ]);

  useEffect(() => {
    const handleSyncProfiles = () => {
      const cachedExpertsRaw = localStorage.getItem("local_expert_profiles");
      if (cachedExpertsRaw) {
        const parsedExperts = JSON.parse(cachedExpertsRaw);
        if (parsedExperts.length > 0) {
          setTopExperts((prevBaselines) => {
            const updatedBaselines = prevBaselines.map(baseline => {
              const matchedUpdate = parsedExperts.find((e: any) => e.id === baseline.id);
              return matchedUpdate ? matchedUpdate : baseline;
            });

            const baselineIds = new Set(updatedBaselines.map(e => e.id));
            const newUniques = parsedExperts.filter((e: ExpertTrader) => !baselineIds.has(e.id));
            
            return [...newUniques, ...updatedBaselines];
          });
        }
      }
    };

    handleSyncProfiles();
    window.addEventListener("storage", handleSyncProfiles);
    return () => window.removeEventListener("storage", handleSyncProfiles);
  }, []);

  const handleToggleCopy = (traderId: string, name: string) => {
    const isCurrentlyCopying = activeCopies.includes(traderId);

    if (!isCurrentlyCopying && activeCopies.length > 0) {
      alert(
        "Operation Blocked\nSimultaneous copying of multiple experts is restricted to maintain strategic integrity. Disconnect your current expert to proceed."
      );
      return;
    }

    if (isCurrentlyCopying) {
      if (confirm(`Are you sure you want to stop mirroring trades from ${name}?`)) {
        setActiveCopies(activeCopies.filter((id) => id !== traderId));
      }
      return;
    }

    setCopyingId(traderId);
    setTimeout(() => {
      setActiveCopies([...activeCopies, traderId]);
      setCopyingId(null);
      alert(`Synchronized Successfully! Your account balance index allocation has been linked to safely mirror ${name}'s market entries.`);
    }, 1200);
  };

  const handleNewProfileCreated = (newProfile: ExpertTrader) => {
    setTopExperts((prev) => [newProfile, ...prev]);
  };

  const handleProfileUpdated = (updatedProfile: ExpertTrader) => {
    setTopExperts((prev) => prev.map((item) => (item.id === updatedProfile.id ? updatedProfile : item)));
  };

  const handleProfileDeleted = (id: string) => {
    setTopExperts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-xl p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Copy Expert Portfolios</h2>
          <p className="text-xs text-gray-500 mt-1">
            Instantly connect your profile wallet margin allocation parameters to mirror trades executed by verified industry professionals.
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-xs tracking-wide transition shadow-md whitespace-nowrap self-start sm:self-auto"
        >
          Become a Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {topExperts.map((trader) => {
          const isCurrentlyCopying = activeCopies.includes(trader.id);
          const isLoadingThisTrader = copyingId === trader.id;
          const isOwnCreatedProfile = !["exp_1", "exp_2", "exp_3"].includes(trader.id);

          return (
            <div 
              key={trader.id}
              className={`bg-[#16181f] border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 border-gray-800 hover:border-gray-700 relative ${
                isCurrentlyCopying ? "ring-1 ring-blue-500/50 bg-[#1a2030]/30" : ""
              }`}
            >
              {isOwnCreatedProfile && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => {
                      if (!trader.isVerified) {
                        alert(
                          "Access Restricted!\nYou must be a verified member to post trade signals. Click the settings gear (⚙️) icon to apply for a verified profile blue tick."
                        );
                        return;
                      }
                      setActiveSignalTrader(trader);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition border ${
                      trader.isVerified
                        ? "bg-emerald-600/10 hover:bg-emerald-600 border-emerald-500/20 text-emerald-400 hover:text-white"
                        : "bg-gray-800/40 border-gray-700/60 text-gray-400 cursor-not-allowed"
                    }`}
                    title={trader.isVerified ? "Post Trade Feed Update" : "Verification Required"}
                  >
                    ⚡ Post Signal
                  </button>
                  <button
                    onClick={() => setSelectedManageProfile(trader)}
                    className="text-gray-500 hover:text-white text-sm transition bg-gray-900/50 hover:bg-gray-900 w-7 h-7 rounded-lg flex items-center justify-center border border-gray-800"
                    title="Edit Page Profiles"
                  >
                    ⚙️
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center text-xl overflow-hidden shadow-inner flex-shrink-0">
                    {trader.avatar.startsWith("data:image") ? (
                      <img src={trader.avatar} alt={trader.name} className="w-full h-full object-cover" />
                    ) : (
                      trader.avatar
                    )}
                  </div>
                  <div className="min-w-0 pr-6">
                    <h3 className="text-sm font-bold text-white leading-tight flex items-center flex-wrap gap-1.5">
                      <span className="truncate">{trader.name}</span>
                      
                      {trader.isVerified && (
                        <span className="text-[10px] bg-blue-500 text-white font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center select-none" title="Verified Trader">
                          ✓
                        </span>
                      )}
                      
                      {isCurrentlyCopying && (
                        <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Linked
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">{trader.specialty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-gray-950/40 border border-gray-900 rounded-lg p-3 text-center mb-6">
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Total ROI</span>
                    <span className="text-xs font-black text-emerald-400 mt-0.5 block">{trader.roi}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Win Rate</span>
                    <span className="text-xs font-black text-blue-400 mt-0.5 block">{trader.winRate}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Risk Level</span>
                    <span className={`text-xs font-black mt-0.5 block ${
                      trader.riskScore === "Low" ? "text-emerald-500" : trader.riskScore === "Medium" ? "text-amber-500" : "text-rose-500"
                    }`}>{trader.riskScore}</span>
                  </div>
                </div>
                {/* Copiers Metrics Info Tracker Row */}
                <div className="flex justify-between items-center text-[11px] text-gray-400 border-b border-gray-800/60 pb-3 mb-6">
                  <span>Active Account Followers:</span>
                  <span className="text-white font-mono font-medium">{trader.copiers.toLocaleString()} investors</span>
                </div>
              </div>

              {/* Execution Request Mirror Configuration CTA Button */}
              <button
                onClick={() => handleToggleCopy(trader.id, trader.name)}
                disabled={copyingId !== null}
                className={`w-full font-semibold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 ${
                  isCurrentlyCopying 
                    ? "bg-rose-950/20 border border-rose-900/40 text-rose-400 hover:bg-rose-900/20" 
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10"
                }`}
              >
                {isLoadingThisTrader ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Establishing Sync Node Link...</span>
                  </>
                ) : isCurrentlyCopying ? (
                  "Stop Copying Portfolio"
                ) : (
                  "Copy Expert Strategy"
                )}
              </button>
            </div>
          );
        })}
      </div>

      <BecomeExpertWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProfileCreated={handleNewProfileCreated}
      />

      <ManageExpertProfile 
        isOpen={selectedManageProfile !== null}
        onClose={() => setSelectedManageProfile(null)}
        traderProfile={selectedManageProfile}
        onProfileUpdated={handleProfileUpdated}
        onProfileDeleted={handleProfileDeleted}
      />

      <PostSignalModal 
        isOpen={activeSignalTrader !== null}
        onClose={() => setActiveSignalTrader(null)}
        expertName={activeSignalTrader?.name || ""}
      />
    </div>
  );
}