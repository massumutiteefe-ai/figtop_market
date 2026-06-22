"use client";

import React, { useState } from "react";

export default function AdminGate() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication refused.");
      }

      // Save a secure key inside the local browser context to protect admin status
      localStorage.setItem("ftm_root_access_token", data.token);
      
      // Redirect straight to your database overview panel
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleAdminAuth} className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-sm w-full space-y-4 shadow-2xl">
        <div className="text-center border-b border-slate-800 pb-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-rose-500 font-mono">Terminal Authentication</h2>
          <p className="text-[10px] text-slate-500">Authorized Master Operator Core Only</p>
        </div>

        {error && (
          <div className="text-[11px] font-mono p-2.5 bg-rose-950/30 border border-rose-800 text-rose-400 rounded text-center">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Master User</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded p-2 text-xs text-slate-200 outline-none font-mono" 
            placeholder="Username"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Security Phrase</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded p-2 text-xs text-slate-200 outline-none font-mono" 
            placeholder="••••••••"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full text-xs font-bold uppercase tracking-wider bg-rose-700 hover:bg-rose-600 disabled:bg-slate-800 text-white p-2.5 rounded transition font-mono"
        >
          {loading ? "Verifying..." : "Initialize Portal"}
        </button>
      </form>
    </div>
  );
}