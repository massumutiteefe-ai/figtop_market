"use client";

import React, { useState, useEffect } from "react";

interface AdminPushNotifierProps {
  onNavigateToTab: (target: "overview" | "clients" | "chat") => void;
}

interface AlertItem {
  id: number;
  event_type: "deposit" | "withdrawal" | "trade" | "chat_message" | "system_alert";
  title: string;
  message_text: string;
}

export default function AdminPushNotifier({ onNavigateToTab }: AdminPushNotifierProps) {
  const [activeAlerts, setActiveAlerts] = useState<AlertItem[]>([]);

  const triggerAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.14);
    } catch (e) {
      console.warn("System audio playback delayed:", e);
    }
  };

  const checkUnreadAlertsPipe = async () => {
    try {
      const res = await fetch("https://onrender.comnotifications.php");
      const data = await res.json();
      if (data.success && data.alerts && data.alerts.length > 0) {
        setActiveAlerts((prev) => [...prev, ...data.alerts]);
        triggerAlertSound();
      }
    } catch (e) {
      console.error("Notification polling pipe breakdown:", e);
    }
  };

  useEffect(() => {
    checkUnreadAlertsPipe();
    const interval = setInterval(checkUnreadAlertsPipe, 4000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlertBox = (id: number) => {
    setActiveAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAlertBoxClick = (alert: AlertItem) => {
    if (alert.event_type === "chat_message") {
      onNavigateToTab("chat");
    } else {
      onNavigateToTab("overview");
    }
    dismissAlertBox(alert.id);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full font-sans select-none pointer-events-none">
      {activeAlerts.map((alert) => (
        <div
          key={alert.id}
          onClick={() => handleAlertBoxClick(alert)}
          className={`p-4 rounded-xl border flex gap-3 shadow-2xl transform transition-all duration-300 translate-y-0 scale-100 hover:scale-[1.02] cursor-pointer pointer-events-auto animate-fade-in ${
            alert.event_type === "chat_message" ? "bg-emerald-950/95 border-emerald-500 text-emerald-100 shadow-emerald-500/10" :
            alert.event_type === "deposit" ? "bg-blue-950/95 border-blue-500 text-blue-100 shadow-blue-500/10" :
            alert.event_type === "withdrawal" ? "bg-rose-950/95 border-rose-500 text-rose-100 shadow-rose-500/10" :
            "bg-slate-950/95 border-slate-700 text-slate-100 shadow-black/30"
          }`}
        >
          <div className="text-base font-bold shrink-0 select-none">
            {alert.event_type === "chat_message" ? "💬" :
             alert.event_type === "deposit" ? "📥" :
             alert.event_type === "withdrawal" ? "📤" : "⚠️"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold tracking-wide text-xs uppercase mb-0.5">{alert.title}</h4>
            <p className="text-[11px] opacity-90 leading-relaxed font-medium break-words">{alert.message_text}</p>
            <span className="text-[9px] opacity-40 block mt-1.5 font-mono">⚡ Click to view workspace</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissAlertBox(alert.id);
            }}
            className="text-slate-400 hover:text-white font-bold self-start text-[11px] bg-white/5 hover:bg-white/10 w-5 h-5 rounded-full flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}