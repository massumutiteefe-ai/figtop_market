"use client";

import React, { useState, useEffect } from "react";

interface WithdrawItem {
  tx_id: string;
  client_id: string;
  client_name: string;
  amount: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  admin_reason: string | null;
  created_at: string;
}

export default function WithdrawalManager() {
  const [withdrawals, setWithdrawals] = useState<WithdrawItem[]>([]);
  const [selectedWith, setSelectedWith] = useState<WithdrawItem | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Retrieve dynamic rows from your central database entry parser log API
  const fetchPendingWithdrawals = async () => {
    try {
      const res = await fetch("https://free.nfget_admin_transaction.php");
      const data = await res.json();
      if (data.success) {
        // Isolate entries that represent unconfirmed, incoming payout requests
        const pendingPayoutsOnly = data.transactions.filter(
          (tx: WithdrawItem) => tx.status === "pending" && tx.type === "withdrawal"
        );
        setWithdrawals(pendingPayoutsOnly);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to parse pending database withdrawals:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
    // Maintain layout state telemetry consistency via clean 8-second polling cycle intervals
    const interval = setInterval(fetchPendingWithdrawals, 8000);
    return () => clearInterval(interval);
  }, []);

  // 2. Dispatch updated resolution parameters back to your database engine processor
  const handleAction = async (actionStatus: "approved" | "rejected") => {
    if (!selectedWith) return;

    try {
      const res = await fetch("https://free.nfprocess_admin_action.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_id: selectedWith.tx_id,
          status: actionStatus,
          admin_reason: reason || "Authorized securely via Admin Control Terminal",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Withdrawal request ${selectedWith.tx_id} successfully marked as ${actionStatus.toUpperCase()}!`);
        setSelectedWith(null);
        setReason("");
        fetchPendingWithdrawals(); // Instant local UI state synchronization loop re-trigger
      } else {
        alert(`Error executing processing instruction: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to push client transaction decision matrix:", err);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg flex flex-col gap-4 shadow-md w-full">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 text-lg">📤</div>
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Client Mail Request for Withdraw</h3>
          <p className="text-xs text-slate-400">Review and authorize asset balance payouts</p>
        </div>
      </div>

      {/* POPUP AUDIT SPACE IF A WITHDRAWAL IS SELECTED */}
      {selectedWith && (
        <div className="bg-slate-900 border border-rose-500/40 p-4 rounded-md space-y-3 font-sans text-xs">
          <div className="text-slate-300 space-y-1 bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
            <p><strong>Transaction ID:</strong> <span className="font-mono text-rose-400 font-bold">{selectedWith.tx_id}</span></p>
            <p><strong>Client Identity:</strong> {selectedWith.client_name} (<span className="font-mono text-[10px] text-slate-500">{selectedWith.client_id}</span>)</p>
            <p><strong>Requested Amount:</strong> <span className="font-mono text-rose-400 font-bold">${parseFloat(selectedWith.amount).toFixed(2)}</span></p>
            <p><strong>Gateway Operation Type:</strong> <span className="uppercase text-slate-400 font-mono text-[10px]">{selectedWith.type}</span></p>
            <p><strong>Log Entry Created:</strong> <span className="text-[10px] text-slate-500">{new Date(selectedWith.created_at).toLocaleString()}</span></p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400">Reason / Description Box:</label>
            <textarea
              className="w-full h-16 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
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
              Reject Payout
            </button>
            <button 
              onClick={() => handleAction("approved")} 
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition shadow"
            >
              Approve Payout
            </button>
          </div>
        </div>
      )}

      {/* LIST OF PENDING ITEMS FROM DATABASE LOOP ROW */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-center text-[11px] text-slate-500 py-2">Syncing database registries...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-center text-[11px] text-slate-500 py-2">🎉 Zero pending withdrawals to verify.</p>
        ) : (
          withdrawals.map(wth => (
            <div key={wth.tx_id} className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded border border-slate-700/50">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-rose-400 font-bold shrink-0">{wth.tx_id}</span>
                  <span className="text-slate-200 truncate">{wth.client_name}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span className="text-rose-400 font-mono font-semibold">${parseFloat(wth.amount).toFixed(2)}</span>
                  <span className="text-slate-600 font-mono text-[9px] uppercase">({wth.type})</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWith(wth)} 
                className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white px-2 py-1 rounded text-[11px] border border-rose-500/30 transition shrink-0 font-bold shadow-sm"
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