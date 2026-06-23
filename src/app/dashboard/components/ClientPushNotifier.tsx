"use client";

import React, { useState, useEffect } from "react";

export default function ClientPushNotifier() {
  const [toast, setToast] = useState<{ title: string; message: string; type: string } | null>(null);
  const [shownAlerts, setShownAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically retrieve the unique session identification token from browser cache memory
    const activeSessionToken = localStorage.getItem("figtop_client_id") || "USR-001";

    const checkNotifications = () => {
      fetch(`https://onrender.comget_unread_notifications.php?client_id=${activeSessionToken}&role=client`)
        .then((res) => res.json())
        .then((alerts) => {
          if (alerts && alerts.length > 0) {
            // Pick up the single latest notification item node block
            const latest = Array.isArray(alerts) ? alerts[0] : alerts;
            
            if (latest && latest.id && !shownAlerts.includes(latest.id)) {
              setToast({ title: latest.title, message: latest.message, type: latest.type });
              setShownAlerts((prev) => [...prev, latest.id]);
              
              // Force database flag read confirmations to stop infinite pumping loops
              fetch("https://onrender.comclear_notifications.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: activeSessionToken })
              }).catch((err) => {
                // Mute inner database connection clear errors during offline states
              });

              // Play browser audio alert sound chime
              try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
                osc.start(); 
                osc.stop(audioCtx.currentTime + 0.15);
              } catch (audioErr) {
                console.log("Audio alert playback deferred by browser context laws");
              }

              // Dismiss popup card automatically after 6 seconds tracking window
              setTimeout(() => setToast(null), 6000);
            }
          }
        })
        .catch((err) => {
          // 🛡️ SAFE FALLBACK PATCH: Mutes terminal log breakdowns when the local PHP server is sleeping
          // Prevents red error dumps from cluttering the development console
        });
    };

    // Run database status record audit checks every 4 seconds
    const interval = setInterval(checkNotifications, 4000);
    return () => clearInterval(interval);
  }, [shownAlerts]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-80 bg-slate-950 border-l-4 p-4 rounded-r-xl shadow-2xl border-emerald-500 text-xs text-slate-100 font-sans">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            🔔 {toast.title}
          </h4>
          <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button 
          onClick={() => setToast(null)} 
          className="text-slate-500 hover:text-white transition duration-150 text-sm p-0.5"
        >
          ✕
        </button>
      </div>
    </div>
  );
}