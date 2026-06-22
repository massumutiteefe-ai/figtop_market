"use client";

import React, { useState } from "react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, msg: "New unread message from John Doe", type: "chat", active: true },
    { id: 2, msg: "Sarah Connor uploaded deposit receipt", type: "deposit", active: true }
  ]);

  const activeCount = notifications.filter(n => n.active).length;

  return (
    <div className="relative">
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition text-sm"
      >
        🔔
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-bounce">
            {activeCount}
          </span>
        )}
      </button>

      {/* POPDOWN BOX */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 text-xs py-1 animate-fade-in">
          <div className="p-2 border-b border-slate-700 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            System Notifications
          </div>
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div key={n.id} className="p-3 border-b border-slate-700/40 hover:bg-slate-700/30 text-slate-200 transition cursor-pointer flex justify-between items-start gap-2">
                <span>{n.msg}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0"></span>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-slate-500">No active system alerts.</p>
          )}
        </div>
      )}
    </div>
  );
}