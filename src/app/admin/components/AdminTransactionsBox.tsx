"use client";

import React, { useState, useEffect } from "react";

interface Transaction {
  tx_id: string;
  client_id: string;
  client_name: string;
  amount: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  admin_reason: string | null;
  created_at: string;
}

export default function AdminTransactionsBox() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal State Engine for displaying voucher screenshots
  const [activeVoucherImage, setActiveVoucherImage] = useState<string | null>(null);

  const fetchTransactions = () => {
    fetch("https://onrender.comget_admin_transaction.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to extract and format Base64 strings from transaction payload
  const renderTypeCell = (tx: Transaction) => {
    // Check if the type column or standard metadata field contains our gift card upload marker string
    if (tx.type.toLowerCase().includes("giftcard") || tx.type.toLowerCase().includes("base64")) {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wide">🎁 Gift Card Voucher</span>
          <button
            type="button"
            onClick={() => {
              // Extract string data content payload if your frontend saved it with a tag prefix wrapper
              const cleanBase64 = tx.type.replace("[GIFT CARD VOUCHER IMAGE] ", "").trim();
              setActiveVoucherImage(cleanBase64);
            }}
            className="text-[10px] bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white px-2 py-0.5 rounded font-bold border border-amber-500/30 transition text-center w-max"
          >
            🖼️ View Voucher Image
          </button>
        </div>
      );
    }
    
    // Fallback standard text rendering block for Crypto, USDT, PayPal, Zelle and Withdrawals
    return <span className="uppercase text-slate-400 font-mono text-[11px]">{tx.type}</span>;
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-4 shadow-xl w-full max-w-5xl relative">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <div>
          <h3 className="font-bold text-emerald-400 uppercase text-sm">Admin Transactions Panel</h3>
          <p className="text-[11px] text-slate-400">Review live payment history entries linked directly with user account names</p>
        </div>
        <button onClick={fetchTransactions} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white transition">
          🔄 Refresh Log
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4 text-slate-400">Loading live data stream...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center py-4 text-slate-400">No active deposit records found in the database.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2 px-3">TX ID</th>
                <th className="py-2 px-3">Client Name</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Gateway Type</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Admin Reason</th>
                <th className="py-2 px-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.tx_id} className="hover:bg-slate-900/30 transition">
                  <td className="py-3 px-3 font-mono text-emerald-400">{tx.tx_id}</td>
                  <td className="py-3 px-3">
                    <span className="text-slate-200 block font-semibold">{tx.client_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tx.client_id}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">${parseFloat(tx.amount).toFixed(2)}</td>
                  
                  {/* Dynamic Cell Router Layout Integration Hook */}
                  <td className="py-3 px-3 min-w-[130px]">{renderTypeCell(tx)}</td>
                  
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      tx.status === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      tx.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 italic max-w-[150px] truncate" title={tx.admin_reason || ""}>
                    {tx.admin_reason || "None specified"}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL RESPONSIVE OVERLAY LIGHTBOX MODAL FOR VOUCHER CLONE DISPLAY INSPECTION */}
      {activeVoucherImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 max-w-xl w-full p-4 rounded-xl shadow-2xl space-y-3 relative flex flex-col items-center">
            <div className="w-full flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">🔒 Secure Voucher Image Viewer</h4>
              <button
                type="button"
                onClick={() => setActiveVoucherImage(null)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs transition"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-950 w-full rounded-lg overflow-hidden flex items-center justify-center max-h-[70vh] border border-slate-950">
              {/* Renders the Base64 source parameters seamlessly into native HTML canvas layout viewports */}
              <img
                src={activeVoucherImage.startsWith("data:") ? activeVoucherImage : `data:image/png;base64,${activeVoucherImage}`}
                alt="Uploaded Client Gift Card Voucher Data asset file link descriptor"
                className="max-w-full max-h-[65vh] object-contain select-text"
              />
            </div>

            <p className="text-[10px] text-slate-500 font-sans italic w-full text-center">
              Verify security serials and authorization hashes closely before triggering approval sequence commands.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}