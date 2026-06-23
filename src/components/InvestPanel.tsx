"use client";

import React, { useState, useEffect } from "react";

interface BotPackage {
  id: string;
  tier: "STANDARD" | "PREMIUM" | "ENTERPRISE";
  name: string;
  description: string;
}

export default function InvestPanel() {
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [isDeployingId, setIsDeployingId] = useState<string | null>(null);
  
  // REAL-TIME BALANCES LIVE PIPELINE DATASTREAM
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [clientId, setClientId] = useState<string | null>(null);

  // 1. Fetch fresh account totals straight from your active PHP back-end endpoints
  useEffect(() => {
    const sessionToken = localStorage.getItem("figtop_client_id");
    if (sessionToken) {
      setClientId(sessionToken);
      
      const fetchCurrentBalance = () => {
        fetch(`https://onrender.comget_client_dashboard.php?client_id=${sessionToken}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.balances?.total_balance) {
              setLiveBalance(parseFloat(data.balances.total_balance));
            }
          })
          .catch((err) => console.error("Invest API Sync Error:", err));
      };

      fetchCurrentBalance();
      const interval = setInterval(fetchCurrentBalance, 3000); // Poll every 3 seconds to keep sync updated
      return () => clearInterval(interval);
    }
  }, []);

  // Removed stock, crypto, and index market tabs leaving exclusively your AI bot choices
  const botPackages: BotPackage[] = [
    {
      id: "bot_std",
      tier: "STANDARD",
      name: "Affiliate Tier Bot",
      description: "Broad audience outreach campaigns across automated ad pipelines.",
    },
    {
      id: "bot_prem",
      tier: "PREMIUM",
      name: "Affiliate Tier Bot Niche",
      description: "Category-specific target audience funnels for designated markets.",
    },
    {
      id: "bot_ent",
      tier: "ENTERPRISE",
      name: "Affiliate Tier Bot eCommerce",
      description: "High-intent buyer video ad placements optimized for retail fronts.",
    },
  ];

  const handleInputChange = (botId: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [botId]: value }));
  };

  const handleDeployBot = async (bot: BotPackage) => {
    const inputAmount = Number(amounts[bot.id]);

    if (!amounts[bot.id] || inputAmount <= 0) {
      return alert("Please enter a valid investment amount!");
    }

    if (inputAmount > liveBalance) {
      return alert(
        `Operation Blocked:\nInsufficient funds. Your live available balance is $${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`
      );
    }

    if (confirm(`Confirm allocation of $${inputAmount.toLocaleString()} to deploy ${bot.name}?`)) {
      setIsDeployingId(bot.id);

      try {
        const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
        const updatedTotalBalance = liveBalance - inputAmount;

        // 2. Network Sync: Post data package down your live PHP server database tracking lanes
        const response = await fetch("https://onrender.comdb.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `INSERT INTO transactions (tx_id, client_id, type, amount, status, date) VALUES ('${txId}', '${clientId}', 'Investment Deployment', '-${inputAmount}', 'SUCCESSFUL', NOW());
                    UPDATE balances SET total_balance = '${updatedTotalBalance}' WHERE client_id = '${clientId}';
                    INSERT INTO investments (client_id, name, amount, status, date) VALUES ('${clientId}', '${bot.name}', '${inputAmount}', 'RUNNING', NOW());`
          }),
        });

        if (response.ok) {
          // Trigger global client UI update listeners instantly
          window.dispatchEvent(new CustomEvent("updateLivePortfolioTotal", { detail: -inputAmount }));
          setLiveBalance(updatedTotalBalance);
          
          alert(`Deployment Successful!\nTransaction ID: ${txId}\nYour custom AI Bot package has been activated and is running live.`);
          setAmounts((prev) => ({ ...prev, [bot.id]: "" }));
        } else {
          alert("Server storage database connection update failed.");
        }
      } catch (err) {
        console.error(err);
        alert("Network communication timeout error.");
      } finally {
        setIsDeployingId(null);
      }
    }
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-xl p-8 select-none animate-fadeIn">
      <div className="mb-8 border-b border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Bot Package Manager</h2>
          <p className="text-xs text-gray-500 mt-1">
            Deploy proprietary neural networking nodes to automate high-yield marketing campaign asset loops.
          </p>
        </div>
        <div className="bg-gray-950/40 border border-gray-900 px-4 py-2 rounded-xl text-left sm:text-right self-start sm:self-auto min-w-[140px]">
          <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold">Liquid Balance</span>
          <span className="text-base font-mono text-emerald-400 font-black">${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {botPackages.map((bot) => {
          const isThisLoading = isDeployingId === bot.id;

          return (
            <div 
              key={bot.id} 
              className="bg-[#16181f] border border-gray-800 hover:border-gray-700 rounded-xl p-6 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded ${
                    bot.tier === "STANDARD" ? "bg-blue-600/10 text-blue-400" : bot.tier === "PREMIUM" ? "bg-amber-600/10 text-amber-400" : "bg-purple-600/10 text-purple-400"
                  }`}>
                    {bot.tier}
                  </span>
                  <span className="text-lg">🤖</span>
                </div>
                
                <h3 className="text-sm font-bold text-white tracking-wide mb-1.5">{bot.name}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-6">{bot.description}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] uppercase text-gray-500 font-bold mb-1">Investment Principal</label>
                  <input
                    type="number"
                    disabled={isDeployingId !== null}
                    placeholder="Enter amount (USD)"
                    value={amounts[bot.id] || ""}
                    onChange={(e) => handleInputChange(bot.id, e.target.value)}
                    className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 text-xs p-2.5 rounded-lg text-white font-mono outline-none transition"
                  />
                </div>

                <button
                  onClick={() => handleDeployBot(bot)}
                  disabled={isDeployingId !== null}
                  className={`w-full font-bold py-2.5 rounded-lg text-xs tracking-wide transition shadow-md flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-800 disabled:text-gray-500`}
                >
                  {isThisLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Initializing Node Link...</span>
                    </>
                  ) : (
                    `Deploy ${bot.name}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}