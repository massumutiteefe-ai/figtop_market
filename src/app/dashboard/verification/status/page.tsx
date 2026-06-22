"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function VerificationStatusPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the active session key token tracking parameter context
    localStorage.removeItem("figtop_client_id"); 
    window.location.href = "/auth/login"; 
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#12131a] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl">
        
        {/* BRAND IDENTITY LOGO PROFILE HEADER */}
        <div className="flex items-center justify-center space-x-2 mb-8 select-none">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm">
            ▶
          </div>
          <div className="text-left">
            <h1 className="text-white font-bold leading-none tracking-tight text-sm">
              DIGITAL <span className="text-blue-500">FIGTOP</span>
            </h1>
            <p className="text-[8px] text-gray-500 tracking-widest uppercase mt-0.5">
              Global Innovation Markets
            </p>
          </div>
        </div>

        {/* REVIEWS DESCRIPTIVE SUB-TEXT COPY */}
        <h2 className="text-base font-bold text-white mb-3">
          Account Review — Verification In Progress
        </h2>
        
        <div className="space-y-4 text-xs text-gray-400 text-left leading-relaxed border-b border-gray-800 pb-6 mb-6">
          <p>Your account profile parameters are currently undergoing our standard security screening compliance review routine.</p>
          <p>Our audit team is reviewing the documents you provided to ensure all credentials match your legal specifications.</p>
          <p>
            <span className="text-gray-200 font-semibold">If Approved:</span> Your dashboard will instantly unlock a verified status indicator tick badge and activate complete asset features.
          </p>
          <p>
            <span className="text-gray-200 font-semibold">If Not Approved:</span> You will receive an explicit notice outlining any issues with your document scans so you can re-upload them.
          </p>
          <p className="text-[10px] text-gray-500 italic pt-2 border-t border-gray-800/40">
            We appreciate your patience during this security review cycle and thank you for choosing Digital Figtop Markets.
          </p>
        </div>

        {/* LOADING ANIMATED PROGRESS VISUAL TRACKER BAR ELEMENT */}
        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-8 relative">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-3/4 rounded-full absolute left-0 animate-pulse"></div>
        </div>

        {/* SESSION TERMINATION ESCAPE SELECTION BUTTON */}
        <button 
          onClick={handleLogout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 px-6 rounded-lg transition-colors shadow-md shadow-blue-600/10"
        >
          Return to Login Frame
        </button>

      </div>
    </div>
  );
}