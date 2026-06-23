"use client";

import React, { useState, useEffect } from "react";
import BalanceDisplay from "./components/BalanceDisplay";
import ActiveInvestment from "./components/ActiveInvestment";
import TxHistory from "./components/TxHistory";
import SupportChat from "./components/SupportChat";
import SecuritySettings from "./components/SecuritySettings";
import PersonalInfo from "./components/PersonalInfo";
import ClientNotification from "./components/ClientNotification";
import UpgradeTier from "./components/UpgradeTier";
import CopyExpert from "./components/CopyExpert";
import MarketSignals from "./components/MarketSignals";
import LiveTradingPortal from "./components/LiveTradingPortal";
import TradingTerminal from "./components/TradingTerminal";



// MODULAR EXTRACTED INTERACTION SCREENS
import TradingDesk from "./components/TradingDesk";
import DepositTerminal from "./components/DepositTerminal";
import WithdrawTerminal from "./components/WithdrawTerminal";
import ClientPushNotifier from "./components/ClientPushNotifier";

// NEW SYSTEM MODULES INJECTED ACCORDING TO USER REQUIREMENTS
import AdvancedVerificationWizard from "./verification/page";
import TakeTrade from "./components/TakeTrade";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<
    "home" | "chat" | "security" | "info" | "invest_market" | "verification" | "upgrade" | "copy_expert" | "signals" | "live_trading"
  >("home");
  
  const [subView, setSubView] = useState<"none" | "deposit" | "withdraw" | "history">("none");
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState<boolean>(true); // Keeps dropdown expanded by default
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientId, setClientId] = useState<string | null>(null);

  // FETCH DATA PIPELINE LINK FROM AUTH SESSION KEY
  useEffect(() => {
    const sessionToken = localStorage.getItem("figtop_client_id");
    if (!sessionToken) {
      alert("Session expired. Please sign in again.");
      window.location.href = "/auth/login";
      return;
    }
    setClientId(sessionToken);

    fetch(`https://onrender.comget_client_dashboard.php?client_id=${sessionToken}`)
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const refreshData = () => {
    if (!clientId) return;
    fetch(`https://onrender.comget_client_dashboard.php?client_id=${clientId}`)
      .then((res) => res.json())
      .then((data) => setDbData(data))
      .catch((err) => console.error(err));
  };

  const handleActionRoute = (action: "deposit" | "invest" | "history" | "withdraw") => {
    if (action === "invest") {
      setActiveTab("invest_market");
      setSubView("none");
    } else {
      setActiveTab("home");
      setSubView(action);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-xs font-mono text-blue-400">
        MOUNTING SECURE LEDGER PIPELINE...
      </div>
    );
  }

  const clientName = dbData?.profile 
    ? `${dbData.profile.surname} ${dbData.profile.last_name}` 
    : "Client Portfolio";

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 font-sans flex relative">
      <ClientPushNotifier />

      {/* RESTRUCTURED SIDEBAR NAVIGATION COLUMN (MATCHES VISUAL SPECIFICATIONS) */}
      <aside className="w-64 bg-[#12131a] border-r border-gray-800 flex flex-col justify-between flex-shrink-0 min-h-screen select-none">
        <div>
          {/* DIGITAL FIGTOP BRAND BRANDING HEADER */}
          <div className="p-6 border-b border-gray-800/60 flex items-center space-x-3">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm">
              ▶
            </div>
            <div>
              <h2 className="text-white font-bold leading-none tracking-tight text-sm">
                DIGITAL <span className="text-blue-500">FIGTOP</span>
              </h2>
              <p className="text-[8px] text-gray-500 tracking-widest uppercase mt-0.5">
                Global Innovation Markets
              </p>
            </div>
          </div>

          {/* MAIN SIDEBAR INTERFACE WRAPPER LAYOUT */}
          <nav className="p-4 space-y-1">
            
            {/* ITEM: DROP-DOWN PARENT TAB CONTEXT (DASHBOARD) */}
            <div>
              <button 
                onClick={() => {
                  setActiveTab("home");
                  setIsDashboardDropdownOpen(!isDashboardDropdownOpen);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activeTab === "home" ? "bg-blue-600/10 text-blue-400" : "text-gray-400 hover:bg-gray-800/40 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span>🏠</span>
                  <span>Dashboard</span>
                </div>
                <span className={`text-[10px] transition-transform duration-200 ${isDashboardDropdownOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {/* RE-ROUTED DROPDOWN CHILD LAYOUT TREE NESTING SELECTIONS */}
              {isDashboardDropdownOpen && (
                <div className="mt-1 ml-4 pl-3 border-l border-gray-800 space-y-1 animate-fadeIn">
                  
                  <button 
                    onClick={() => setActiveTab("verification")}
                    className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
                      activeTab === "verification" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    }`}
                  >
                    <span>🛡️</span>
                    <span>Verify Account</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("upgrade")}
                    className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
                      activeTab === "upgrade" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    }`}
                  >
                    <span>⚡</span>
                    <span>Upgrade Tier</span>
                  </button>
                  
                   <button 
      onClick={() => {
        setActiveTab("invest_market");
        setSubView("none");
      }}
      className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
        activeTab === "invest_market" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
      }`}
    >
      <span>🚀</span>
      <span>Invest Markets</span>
    </button>
                   

                  <button 
                    onClick={() => setActiveTab("copy_expert")}
                    className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
                      activeTab === "copy_expert" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    }`}
                  >
                    <span>👥</span>
                    <span>Copy Experts</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("signals")}
                    className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
                      activeTab === "signals" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    }`}
                  >
                    <span>📡</span>
                    <span>Market Signals</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("live_trading")}
                    className={`w-full text-left px-3 py-2 rounded-md text-[11px] font-medium flex items-center space-x-2 transition ${
                      activeTab === "live_trading" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
                    }`}
                  >
                    <span>📈</span>
                    <span>Live Trading Portal</span>
                  </button>

                </div>
              )}
            </div>

            {/* QUICK LINK TERMINAL PORTALS (DEPOSIT / WITHDRAW RE-MAPPED AS SIDEBAR MENUS) */}
            <button 
              onClick={() => handleActionRoute("deposit")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                subView === "deposit" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/40"
              }`}
            >
              <span>💳</span>
              <span>Deposit Funds</span>
            </button>

            <button 
              onClick={() => handleActionRoute("withdraw")}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                subView === "withdraw" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/40"
              }`}
            >
              <span>💰</span>
              <span>Withdraw Terminal</span>
            </button>

            {/* TRADITIONAL ANCILLARY SYSTEM VIEWS */}
            <button 
              onClick={() => {
                setActiveTab("chat");
                setSubView("none");
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeTab === "chat" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/40"
              }`}
            >
              <span>💬</span>
              <span>Support Desk</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab("security");
                setSubView("none");
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeTab === "security" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/40"
              }`}
            >
              <span>🔒</span>
              <span>Security Panel</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab("info");
                setSubView("none");
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeTab === "info" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/40"
              }`}
            >
              <span>👤</span>
              <span>Personal File</span>
            </button>
          </nav>
        </div>

        {/* BOTTOM TERMINATION SECURE LOGOUT BLOCK BUTTON */}
        <div className="p-4 border-t border-gray-800/60">
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to log out of Figtop Markets?")) {
                localStorage.removeItem("figtop_client_id");
                window.location.href = "/auth/login";
              }
            }}
            className="w-full bg-red-950/20 border border-red-900/40 text-red-400 hover:bg-red-900/20 py-2.5 rounded-lg text-xs font-bold tracking-wide transition"
          >
            Logout Securely 🚪
          </button>
        </div>
      </aside>

      {/* CORE WORKSPACE VIEW WINDOW FRAME */}
      <div className="flex-1 flex flex-col p-8 min-w-0 bg-[#0a0b0d]">
        <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome back, {clientName}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage and track your active index deployment allocations.</p>
          </div>
          <ClientNotification />
        </header>

        <main className="flex-1">
          {/* DEFAULT CORE DESKTOP VIEW GRID */}
          {activeTab === "home" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-6">
                <BalanceDisplay onActionClick={handleActionRoute} liveBalance={dbData?.profile?.balance || "0.00"} />
                <ActiveInvestment liveInvestments={dbData?.investments || []} />
              </div>
              <div className="lg:col-span-1">
                {subView === "history" && <TxHistory liveTx={dbData?.transactions || []} />}
                {subView === "deposit" && <DepositTerminal />}
                {subView === "withdraw" && <WithdrawTerminal />}
                {subView === "none" && (
                  <div className="bg-[#12131a] p-5 rounded-xl border border-gray-800 text-center text-xs text-gray-500 py-12">
                    Interact with quick buttons to display context parameters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DYNAMIC SYSTEM TABS INJECTION MOUNT */}
          {activeTab === "verification" && <AdvancedVerificationWizard />}

          {activeTab === "upgrade" && (
            <div className="bg-[#12131a] p-8 border border-gray-800 rounded-xl text-center">
              <h2 className="text-lg font-bold mb-2">Upgrade Account Tier</h2>
              <p className="text-xs text-gray-400">Premium packages and tier activation terminals are loading...</p>
            </div>
          )}

          {activeTab === "copy_expert" && <CopyExpert />}   

          {activeTab === "signals" && <MarketSignals />}

          {activeTab === "live_trading" && <LiveTradingPortal />}
          {activeTab === "live_trading" && <TakeTrade />}
         
          
        
           
          {activeTab === "verification" && <AdvancedVerificationWizard />}
          {activeTab === "upgrade" && <UpgradeTier />}

          {activeTab === "invest_market" && (
            <TradingDesk onReturn={() => setActiveTab("home")} onRefreshData={refreshData} />
          )}

          {activeTab === "chat" && <SupportChat />}
          {activeTab === "security" && <SecuritySettings profile={dbData?.profile} />}
          {activeTab === "info" && <PersonalInfo profile={dbData?.profile} />}
        </main>
      </div>
    </div>
  );
}