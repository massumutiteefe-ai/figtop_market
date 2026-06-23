'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return alert("Please enter both your email address and password.");
    }

    setLoading(true);
    try {
      const res = await fetch("https://free.nflogin.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      
      if (data.success) {
        alert(`Access Granted! Welcome back.`);
        // Lock user tracking session key securely in client browser memory
        localStorage.setItem("figtop_client_id", data.client_id);
        router.push("/dashboard"); // Redirects right into trading workspace
      } else {
        alert(`Login Refused: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Authentication API link connection timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b19] text-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0f162e] p-8 rounded-xl shadow-2xl w-full max-w-md space-y-5 border border-slate-800/40 animate-fade-in"
      >
        <div className="text-center pb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign In</h1>
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <label className="text-slate-400 font-medium">Email Address</label>
          <input 
            name="email" 
            type="email" 
            placeholder="Enter your email address" 
            value={formData.email} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500 text-sm" 
          />
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <label className="text-slate-400 font-medium">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Enter password" 
            value={formData.password} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a2238] text-white border border-gray-700 outline-none focus:border-blue-500 text-sm" 
          />
        </div>

        {/* PROPER FIXED FORM BUTTON ATTACHMENT */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-3 rounded-lg font-bold uppercase text-xs tracking-wider transition shadow-md mt-2"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-xs text-center text-slate-400 pt-1">
          Don't have an account? <Link href="/auth/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}