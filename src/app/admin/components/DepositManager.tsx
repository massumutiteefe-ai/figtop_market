"use client";

import React, { useState, useEffect } from "react";

interface DepositItem {
  tx_id: string;
  client_id: string;
  client_name: string;
  amount: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  admin_reason: string | null;
  created_at: string;
}

export default function DepositManager() {
  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [selectedDep, setSelectedDep] = useState<DepositItem | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Fetch live pending rows from your existing admin transaction endpoint
  const fetchPendingDeposits = async () => {
    try {
      const res = await fetch("https://free.nfget_admin_transaction.php");
      const data = await res.json();
      if (data.success) {
        // Filter out withdrawals and completed transactions; only show pending deposits
        const pendingDepositsOnly = data.transactions.filter(
          (tx: DepositItem) => tx.status === "pending" && tx.type !== "withdrawal"
        );
        setDeposits(pendingDepositsOnly);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to retrieve pending database deposits:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDeposits();
    // Poll for changes every 8 seconds to capture new deposit requests instantly
    const interval = setInterval(fetchPendingDeposits, 8000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fire action parameters directly down to process_admin_action.php
  const handleAction = async (actionStatus: "approved" | "rejected") => {
    if (!selectedDep) return;

    try {
      const res = await fetch("https://free.nfprocess_admin_action.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_id: selectedDep.tx_id,
          status: actionStatus,
          admin_reason: reason || "Processed securely via Admin Control Terminal",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Deposit transaction ${selectedDep.tx_id} has been successfully ${actionStatus.toUpperCase()}!`);
        setSelectedDep(null);
        setReason("");
        fetchPendingDeposits(); // Proactively re-pull layout streams to update UI state instantly
      } else {
        alert(`Error executing action: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to post decision criterion metrics payload:", err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg flex flex-col gap-4 shadow-md w-full">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-lg">📥</div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Client Mail Queries for Deposit</h3>
          <p className="text-xs text-slate-400">Review, approve, or reject funding tickets</p>
        </div>
      </div>

      {/* POPUP AUDIT SPACE IF A DEPOSIT IS SELECTED */}
      {selectedDep && (
        <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-md space-y-3 font-sans text-xs">
          <div className="text-slate-300 space-y-1 bg-slate-950/40 p-2.5 rounded border border-slate-800">
            <p><strong>Transaction ID:</strong> <span className="font-mono text-emerald-400">{selectedDep.tx_id}</span></p>
            <p><strong>Client:</strong> {selectedDep.client_name} (<span className="font-mono text-[10px] text-slate-500">{selectedDep.client_id}</span>)</p>
            <p><strong>Settlement Amount:</strong> <span className="font-mono text-emerald-400 font-bold">${parseFloat(selectedDep.amount).toFixed(2)}</span></p>
            <p><strong>Gateway Variant Type:</strong> <span className="uppercase text-slate-400 font-mono text-[10px]">{selectedDep.type}</span></p>
            <p><strong>Date Dispatched:</strong> <span className="text-[10px] text-slate-500">{new Date(selectedDep.created_at).toLocaleString()}</span></p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400">Reason / Description Box:</label>
            <textarea
              className="w-full h-16 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
              placeholder="Provide reason for approval or rejection (forwarded directly to user live)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 text-xs">
            <button 
              onClick={() => handleAction("rejected")} 
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold transition shadow"
            >
              Reject Deposit
            </button>
            <button 
              onClick={() => handleAction("approved")} 
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition shadow"
            >
              Approve Deposit
            </button>
          </div>
        </div>
      )}

      {/* LIST OF PENDING ITEMS FROM DATABASE LOOP ROW */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-center text-[11px] text-slate-500 py-2">Syncing with database...</p>
        ) : deposits.length === 0 ? (
          <p className="text-center text-[11px] text-slate-500 py-2">🎉 Zero pending deposits to verify.</p>
        ) : (
          deposits.map(dep => (
            <div key={dep.tx_id} className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded border border-slate-700/50">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-emerald-400 font-bold shrink-0">{dep.tx_id}</span>
                  <span className="text-slate-200 truncate">{dep.client_name}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-400 font-mono font-semibold">${parseFloat(dep.amount).toFixed(2)}</span>
                  <span className="text-slate-600 font-mono text-[9px] uppercase">({dep.type})</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDep(dep)} 
                className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1 rounded text-[11px] border border-emerald-500/30 transition shrink-0 font-bold shadow-sm"
              >
                Open Audit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}