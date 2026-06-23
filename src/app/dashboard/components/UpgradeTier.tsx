"use client";

import React, { useState, useEffect } from "react";

interface TierPackage {
  name: string;
  priceRange: string;
  icon: string;
  color: string;
  shadowColor: string;
  cost: number; // Injected required exact payment parameters logic
  features: string[];
}

export default function UpgradeTier() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Real-time wallet tracking states synced directly from your server logic arrays
  const [liveBalance, setLiveBalance] = useState<number>(0);
  const [clientId, setClientId] = useState<string | null>(null);

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
          .catch((err) => console.error("Upgrade Sync Error:", err));
      };

      fetchCurrentBalance();
      const interval = setInterval(fetchCurrentBalance, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  const dynamicTiers: TierPackage[] = [
    {
      name: "Silver Tier",
      priceRange: "$1,000 - $4,999",
      icon: "🥈",
      color: "border-slate-500 text-slate-300",
      shadowColor: "shadow-slate-500/10",
      cost: 1000,
      features: [
        "Access to Basic Trading Signals",
        "Standard Copy Trading Mirroring",
        "Weekly Market Insight Reports",
        "Standard Customer Support (24/5)",
        "Leverage capabilities up to 1:100",
      ],
    },
    {
      name: "Gold Pro Tier",
      priceRange: "$5,000 - $19,999",
      icon: "🥇",
      color: "border-amber-500 text-amber-400",
      shadowColor: "shadow-amber-500/10",
      cost: 5000,
      features: [
        "Priority Alpha Market Signals",
        "Expert Mirror Copy Mode Enabled",
        "Daily Technical Analysis Files",
        "Dedicated Account Specialist Manager",
        "Leverage capabilities up to 1:300",
        "1 Free Automated Bot Implementation",
      ],
    },
    {
      name: "Diamond Executive",
      priceRange: "$20,000+",
      icon: "💎",
      color: "border-blue-500 text-blue-400",
      shadowColor: "shadow-blue-500/10",
      cost: 20000,
      features: [
        "Real-Time Institutional Signals",
        "Direct API Expert Copy Execution",
        "Custom Tailored Portfolio Structuring",
        "Direct VIP Phone Support (24/7)",
        "Maximum Institutional Leverage 1:500",
        "Unlimited Custom Trading Bot Access",
        "Insured Capital Protection Plan",
      ],
    },
  ];

  const handleRequestUpgrade = async (tier: TierPackage) => {
    if (liveBalance < tier.cost) {
      return alert(
        `Operation Blocked:\nInsufficient funds. The standard setup cost required to activate the ${tier.name} is $${tier.cost.toLocaleString()}. Your balance is $${liveBalance.toLocaleString()}.`
      );
    }

    if (!confirm(`Confirm transaction payment of $${tier.cost.toLocaleString()} to upgrade your platform rank to ${tier.name}?`)) {
      return;
    }

    setSelectedTier(tier.name);
    setIsProcessing(true);
    
    try {
      const txId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const updatedTotalBalance = liveBalance - tier.cost;

      // Synchronize changes to your central PHP server sql databases securely
      const response = await fetch("https://onrender.comdb.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `INSERT INTO transactions (tx_id, client_id, type, amount, status, date) VALUES ('${txId}', '${clientId}', 'Account Upgrade (${tier.name})', '-${tier.cost}', 'SUCCESSFUL', NOW());
                  UPDATE balances SET total_balance = '${updatedTotalBalance}' WHERE client_id = '${clientId}';
                  UPDATE profile SET account_tier = '${tier.name}' WHERE client_id = '${clientId}';`
        }),
      });

      if (response.ok) {
        // Broadcast custom listener event signals to reset top dashboard layout values live
        window.dispatchEvent(new CustomEvent("updateLivePortfolioTotal", { detail: -tier.cost }));
        setLiveBalance(updatedTotalBalance);
        alert(`Upgrade Successful!\nYour account parameter configurations have been scaled to ${tier.name} status. Transaction ID: ${txId}`);
      } else {
        alert("Server database ledger integration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Network routing pipeline communication timeout exception.");
    } finally {
      setIsProcessing(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-xl p-8 animate-fadeIn">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upgrade Premium Portfolio Tier</h2>
          <p className="text-xs text-gray-500 mt-1">Select an optimal investment margin tier to scale your market leverage limits and unlock priority indicators.</p>
        </div>
        <div className="bg-gray-950/40 border border-gray-900 px-4 py-2 rounded-xl min-w-[140px]">
          <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold">Liquid Balance</span>
          <span className="text-sm font-mono text-emerald-400 font-black">${liveBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Grid Interface Wrapper Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dynamicTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`bg-[#16181f] border rounded-xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#1b1e26] ${tier.color} ${tier.shadowColor}`}
          >
            <div>
              {/* Card Title Header Section */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{tier.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-gray-900 px-2 py-0.5 rounded text-gray-400 border border-gray-800">
                  Account Type
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-sm font-extrabold tracking-tight mb-6 text-gray-300">{tier.priceRange}</p>

              {/* Feature Points Content Bullet Tree */}
              <ul className="space-y-2.5 border-t border-gray-800/80 pt-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-[11px] text-gray-400 leading-tight">
                    <span className="text-blue-500 text-xs font-bold select-none">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Trigger Selection Toggle Button */}
            <button
              onClick={() => handleRequestUpgrade(tier)}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-md shadow-blue-600/10 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isProcessing && selectedTier === tier.name ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing Payment...</span>
                </>
              ) : (
                `Activate ${tier.name.split(' ')[0]}`
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}