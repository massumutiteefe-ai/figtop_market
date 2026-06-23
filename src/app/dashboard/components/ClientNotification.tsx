"use client";

import React, { useState, useEffect } from "react";

export default function ClientNotification() {
  const [open, setOpen] = useState(false);
  const [unreadMsg, setUnreadMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadAlert = () => {
      fetch("https://free.nfget_unread_notifications.php?client_id=USR-001&role=client")
        .then((res) => res.json())
        .then((alerts) => {
          if (alerts && alerts.length > 0) {
            const chatAlert = alerts.find((a: any) => a.id === "MSG-INBOUND");
            if (chatAlert) {
              setUnreadMsg(chatAlert.message);
            } else {
              setUnreadMsg(null);
            }
          } else {
            setUnreadMsg(null);
          }
        })
        .catch((err) => {
          // 🛡️ SAFE FALLBACK PATCH: Mute terminal log breakdowns when server is sleeping
          // By resetting the unread message to null, the app remains stable during offline states
          setUnreadMsg(null);
        });
    };

    fetchUnreadAlert();
    const interval = setInterval(fetchUnreadAlert, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition">
        💬 {unreadMsg && <span className="absolute -top-1 -right-1 bg-emerald-500 h-2 w-2 rounded-full font-bold text-white animate-pulse"></span>}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-xs animate-fade-in">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 border-b border-slate-900 pb-1">Unread Alerts</h4>
          {unreadMsg ? (
            <p className="text-slate-200 leading-relaxed font-sans">
              ✉️ New message from support team desk: <strong className="text-emerald-400 italic block mt-1">"{unreadMsg}"</strong>
            </p>
          ) : (
            <p className="text-slate-500 font-sans text-center py-2">No unread alerts or new text logs.</p>
          )}
        </div>
      )}
    </div>
  );
}