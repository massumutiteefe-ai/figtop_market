"use client";

import React from "react";

interface TxHistoryProps {
  liveTx: any[];
}

export default function TxHistory({ liveTx }: TxHistoryProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl shadow-xl space-y-3">
      <h3 className="text-sm font-bold text-slate-200 border-b border-slate-700 pb-2">Transaction Details History</h3>
      <div className="space-y-2 max-h-[250px] overflow-y-auto text-xs font-mono pr-1">
        {liveTx && liveTx.length > 0 ? (
          liveTx.map((log: any) => {
            const isApproved = log.status === "approved";
            const isRejected = log.status === "rejected";
            
            return (
              <div key={log.tx_id} className="bg-slate-900 border border-slate-800 p-3 rounded space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 capitalize">{log.created_at ? log.created_at.substring(0, 10) : "Recent"} ({log.type})</span>
                  <span className={isApproved ? "text-emerald-400 font-bold" : isRejected ? "text-rose-400 font-bold" : "text-amber-400 font-bold"}>
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(log.amount))}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Ref: {log.tx_id}</span>
                  <span className={`uppercase font-sans font-bold text-[9px] ${isApproved ? "text-emerald-400" : isRejected ? "text-rose-400" : "text-amber-400"}`}>
                    {log.status}
                  </span>
                </div>
                {log.admin_reason && (
                  <p className="text-[10px] font-sans text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-800 mt-1 leading-relaxed">
                    Note: {log.admin_reason}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-slate-500 text-center py-4 font-sans">No transaction entries found on ledger.</p>
        )}
      </div>
    </div>
  );
}