'use client';

import React, { useState, useEffect } from 'react';

interface BotProps {
  apiEndpoint: string;
}

interface BotPackage {
  id: string;
  name: string;
  description: string;
  tier: "STANDARD" | "PREMIUM" | "ENTERPRISE";
}

export default function BotPackagesView({ apiEndpoint }: BotProps) {
  const [botAmounts, setBotAmounts] = useState<{ [key: string]: string }>({});
  const [isDeployingId, setIsDeployingId] = useState<string | null>(null);
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [clientId, setClientId] = useState<string | null>(null);

  // Synchronize live account value metrics straight from backend pipelines
  useEffect(() => {
    const sessionToken = localStorage.getItem("figtop_client_id");
    if (sessionToken) {
      setClientId(sessionToken);
      
      const fetchCurrentBalance = () => {
        fetch(`http://localhost/figtop-api/get_client_dashboard.php?client_id=${sessionToken}`)
          .then((res) => res.json())
          .then((data) => {
            if (data?.balances?.total_balance) {
              setLiveBalance(parseFloat(data.balances.total_balance));
            }
          })
          .catch((err) => console.error("Invest Sync Error:", err));
      };

      fetchCurrentBalance();
      const interval = setInterval(fetchCurrentBalance, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const botPackages: BotPackage[] = [
    { 
      id: 'affiliate_bot', 
      name: 'Affiliate Tier Bot', 
      description: 'Broad audience outreach campaigns across automated ad pipelines.',
      tier: 'STANDARD'
    },
    { 
      id: 'niche_bot', 
      name: 'Affiliate Tier Bot Niche', 
      description: 'Category-specific target audience funnels for designated markets.',
      tier: 'PREMIUM'
    },
    { 
      id: 'ecommerce_bot', 
      name: 'Affiliate Tier Bot eCommerce', 
      description: 'High-intent buyer video ad placements optimized for retail fronts.',
      tier: 'ENTERPRISE'
    },
  ];

  const handleAmountChange = (botId: string, value: string) => {
    setBotAmounts(prev => ({ ...prev, [botId]: value }));
  };

  const handleDeployBot = async (bot: BotPackage) => {
    const inputAmount = Number(botAmounts[bot.id]);

    if (!botAmounts[bot.id] || inputAmount <= 0) {
      return alert("Please enter a valid investment amount!");
    }

    if (inputAmount > liveBalance) {
      return alert(
        `Operation Blocked:\nInsufficient liquidity bounds. Your available balance is $${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`
      );
    }

    if (confirm(`Confirm allocation of $${inputAmount.toLocaleString()} to deploy ${bot.name}?`)) {
      setIsDeployingId(bot.id);

      try {
        const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
        const updatedTotalBalance = liveBalance - inputAmount;

        // Secure state pipeline submission payload to back-end PHP endpoints
        const response = await fetch("http://localhost/figtop-api/db.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `INSERT INTO transactions (tx_id, client_id, type, amount, status, date) VALUES ('${txId}', '${clientId}', 'Investment Deployment', '-${inputAmount}', 'SUCCESSFUL', NOW());
                    UPDATE balances SET total_balance = '${updatedTotalBalance}' WHERE client_id = '${clientId}';
                    INSERT INTO investments (client_id, name, amount, status, date) VALUES ('${clientId}', '${bot.name}', '${inputAmount}', 'RUNNING', NOW());`
          }),
        });

        if (response.ok) {
          // Fire event signals to reset top navigation counters instantly
          window.dispatchEvent(new CustomEvent("updateLivePortfolioTotal", { detail: -inputAmount }));
          setLiveBalance(updatedTotalBalance);
          
          alert(`Deployment Successful!\nTransaction ID: ${txId}\nYour AI Bot instance has been compiled and is executing live.`);
          setBotAmounts(prev => ({ ...prev, [bot.id]: "" }));
        } else {
          alert("Server storage update constraint failure.");
        }
      } catch (err) {
        console.error(err);
        alert("Network pipeline execution exception.");
      } finally {
        setIsDeployingId(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full animate-fadeIn select-none mt-4">
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
                  bot.tier === 'STANDARD' ? 'bg-blue-600/10 text-blue-400' : bot.tier === 'PREMIUM' ? 'bg-amber-600/10 text-amber-400' : 'bg-purple-600/10 text-purple-400'
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
                  value={botAmounts[bot.id] || ""}
                  onChange={(e) => handleAmountChange(bot.id, e.target.value)}
                  className="w-full bg-[#12131a] border border-gray-800 focus:border-blue-500 text-xs p-2.5 rounded-lg text-white font-mono outline-none transition"
                />
              </div>

              <button
                onClick={() => handleDeployBot(bot)}
                disabled={isDeployingId !== null}
                className="w-full font-bold py-2.5 rounded-lg text-xs tracking-wide transition shadow-md flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-800 disabled:text-gray-500"
              >
                {isThisLoading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Deploying Affiliate...</span>
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
  );
}