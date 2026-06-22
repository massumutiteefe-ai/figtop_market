"use client";

import React, { useState, useTransition, useEffect } from "react";
import DepositManager from "./components/DepositManager";
import WithdrawalManager from "./components/WithdrawalManager";
import InvestmentSpace from "./components/InvestmentSpace";
import ClientList from "./components/ClientList";
import ChatBox from "./components/ChatBox";
import NotificationBell from "./components/NotificationBell";
import PaymentControl from "./components/PaymentControl";
import AdminPushNotifier from "./components/AdminPushNotifier";
import AdminTransactionsBox from "./components/AdminTransactionsBox";
// 1. Imported the expert profile management control panel here:
import AdminExpertManager from "./components/AdminExpertManager";
import AdminMarketController from "./components/AdminMarketController";
import FigtopSever from "./components/FigtopSever";

export default function ModularAdminDashboard() {
  // SECRET AUTHENTICATION GUARD INTEGRATION
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const masterToken = localStorage.getItem("ftm_root_access_token");
    if (!masterToken) {
      window.location.href = "/secret-vault-gate";
    } else {
      setIsAuthorized(true);
    }
  }, []);

  const [leftNav, setLeftNav] = useState<"overview" | "clients" | "chat">("overview");
  const [investmentTab, setInvestmentTab] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (targetView: "overview" | "clients" | "chat") => {
    startTransition(() => {
      setLeftNav(targetView);
      setInvestmentTab(false);
    });
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch("http://localhost/figtop-api/db.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "UPDATE messages SET is_read=1 WHERE sender='client'"
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center text-xs font-mono select-none">
        Verifying secure operator parameters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex shadow-inner relative select-none">
      
      {/* REAL-TIME CLICKABLE HEADS-UP AUDIT ALERT NOTIFIER */}
      <AdminPushNotifier onNavigateToTab={(target) => handleTabChange(target)} />

      {/* LEFT-COLUMN ICON NAVIGATION BAR BAR */}
      <aside className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-6 gap-5 flex-shrink-0 z-10">
        <div className="text-xl font-black text-emerald-500 mb-4 tracking-tighter select-none font-mono">FTM</div>
        
        <button 
          onClick={() => { setLeftNav("overview"); setInvestmentTab(false); }} 
          title="Dashboard Home" 
          className={`p-3 rounded-xl transition-all duration-150 text-base ${
            leftNav === "overview" && !investmentTab 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 scale-105" 
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          📊
        </button>
        
        <button 
          onClick={() => handleTabChange("clients")} 
          title="Registered Clients List" 
          className={`p-3 rounded-xl transition-all duration-150 text-base ${
            leftNav === "clients" 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 scale-105" 
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          👥
        </button>
        
        <button 
          onClick={() => { handleTabChange("chat"); markMessagesAsRead(); }} 
          title="Support Chat" 
          className={`p-3 rounded-xl transition-all duration-150 text-base ${
            leftNav === "chat" 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/10 scale-105" 
              : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          💬
        </button>
      </aside>

      {/* RIGHT SIDE MAIN CONTAINER CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col p-6 min-w-0 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center border-b border-slate-700/60 pb-4 mb-6 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400">Admin Database Overview</h1>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide uppercase mt-0.5">
              Mode: {investmentTab ? "INVESTMENT CONTROLLER" : leftNav}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PaymentControl />
            <button 
              onClick={() => setInvestmentTab(!investmentTab)} 
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 transform active:scale-98 ${
                investmentTab 
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/10" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 hover:text-white"
              }`}
            >
              {investmentTab ? "Close Investment Space" : "Active Investment Space"}
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* CORE ACTIVE REGION INTERACTION WINDOW */}
        <main className={`flex-1 flex flex-col gap-6 transition-opacity duration-150 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex-1 flex flex-col min-h-0">
            {investmentTab ? (
              <InvestmentSpace />
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {leftNav === "overview" && (
                  <div className="space-y-6 w-full">
                    {/* Upper Metrics/Transactions Grid Layout Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start w-full">
                      
                      {/* LEFT SIDEBAR ROW (Takes 1 column out of 3) */}
                      <div className="xl:col-span-1 flex flex-col gap-4">
                        <DepositManager />
                        <WithdrawalManager />
                      </div>

                      {/* RIGHT COLUMN MAIN PANEL (Takes 2 columns out of 3) */}
                      <div className="xl:col-span-2 w-full overflow-hidden">
                        <AdminTransactionsBox />
                      </div>
                    </div>

                    {/* 2. Embedded the expert profiles parameter control panel layout row here! */}
                    <AdminExpertManager />
                    <AdminMarketController />
                     <FigtopSever />
                  </div>
                )}
                
                {leftNav === "clients" && <ClientList />}
                {leftNav === "chat" && <ChatBox />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}