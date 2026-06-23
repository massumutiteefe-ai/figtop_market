'use client';

import React, { useEffect, useState } from 'react';

interface ActiveInvestmentProps {
  liveInvestments?: any[];
}

interface StructuredInvestment {
  asset: string;
  price: number;
  invested: number;
  percent: string;
  result: number;
  isProfit: boolean;
  isClosed?: boolean;
  closePayout?: number;
}

export default function ActiveInvestment({ liveInvestments = [] }: ActiveInvestmentProps) {
  const [currentView, setCurrentView] = useState<'active' | 'closed'>('active');
  const [activeItems, setActiveItems] = useState<StructuredInvestment[]>([]);
  const [closedItems, setClosedItems] = useState<StructuredInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPositions = async () => {
    // 🌟 SSR PROTECTION GATE: Bypass code if executing on Node server
    if (typeof window === 'undefined') return;

    try {
      const sessionToken = localStorage.getItem("figtop_client_id") || "user1";
      
      // 1. Fetch running active positions
      const activeRes = await fetch(`https://onrender.comgetInvestments.php?user_id=${sessionToken}`);
      const activeText = await activeRes.text();
      
      if (activeText.trim().startsWith('[') || activeText.trim().startsWith('{')) {
        const activeData = JSON.parse(activeText);
        if (Array.isArray(activeData)) {
          setActiveItems(activeData);
          
          // Dispatch live compounding total calculation parameters to main balance card
          if (activeData.length === 0) {
            window.dispatchEvent(new (window as any).CustomEvent('updateLivePortfolioTotal', { detail: 0 }));
          } else {
            const runningPositionsTotal = activeData.reduce((sum: number, item: any) => sum + Number(item.result), 0);
            window.dispatchEvent(new (window as any).CustomEvent('updateLivePortfolioTotal', { detail: runningPositionsTotal }));
          }
        }
      }

      // 2. Fetch completed historical positions
      const closedRes = await fetch(`https://onrender.comgetClosedInvestments.php?user_id=${sessionToken}`);
      const closedText = await closedRes.text();
      
      if (closedText.trim().startsWith('[') || closedText.trim().startsWith('{')) {
        const closedData = JSON.parse(closedText);
        if (Array.isArray(closedData)) {
          setClosedItems(closedData);
        }
      }

    } catch (err) {
      console.error("Failed to load portfolio ledger data streams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 4000); // Sync active ledger records every 4s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-xl text-center text-xs font-mono text-slate-500 animate-pulse">
        Syncing active running positions ledger variables...
      </div>
    );
  }

  const targetedList = currentView === 'active' ? activeItems : closedItems;

  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6 shadow-xl space-y-4">
      
      {/* Clickable Header Button Selection Matrix */}
      <div className="flex items-center gap-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setCurrentView('active')}
          className={`text-sm font-extrabold tracking-wider uppercase transition-all relative ${
            currentView === 'active' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Investments
          {currentView === 'active' && <div className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-orange-500 rounded" />}
        </button>

        <button
          onClick={() => setCurrentView('closed')}
          className={`text-sm font-extrabold tracking-wider uppercase transition-all relative ${
            currentView === 'closed' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Closed Investments
          {currentView === 'closed' && <div className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-orange-500 rounded" />}
        </button>
      </div>

      {/* Render Selected View Data Rows */}
      {targetedList.length === 0 ? (
        <div className="text-center py-10 text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-lg bg-slate-950/10">
          No {currentView} investment contracts found in account profile ledger records.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                <th className="pb-3 px-2 font-semibold">Asset Name</th>
                <th className="pb-3 font-semibold">Show Price</th>
                <th className="pb-3 font-semibold">Invested Amount</th>
                <th className="pb-3 text-right font-semibold">Outcome / Percent</th>
                <th className="pb-3 text-right pr-2 font-semibold">
                  {currentView === 'active' ? 'Result' : 'Final Payout'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-medium text-slate-300">
              {targetedList.map((row, index) => (
                <tr key={index} className="hover:bg-slate-800/20 transition duration-150">
                  <td className="py-3.5 px-2 font-bold capitalize text-slate-200">{row.asset}</td>
                  <td className="py-3.5 font-mono text-slate-400">
                    {row.asset.includes('bot') ? 'Automated' : `$${Number(row.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </td>
                  <td className="py-3.5 font-mono text-blue-400 font-semibold">${currencyFormat(row.invested)}</td>
                  <td className={`py-3.5 text-right font-mono font-bold ${row.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    {row.percent}
                  </td>
                  <td className={`py-3.5 text-right pr-2 font-mono font-black ${row.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    ${currencyFormat(row.result)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function currencyFormat(val: any) {
  const num = Number(val);
  return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { minimumFractionDigits: 2 });
}