import React from "react";

export default function AboutPage() {
  return (
    <div className="p-12 bg-[#0b0f1a] text-gray-200 min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="bg-[#111827] border border-gray-800 p-8 rounded-xl max-w-md text-center shadow-xl">
        <h1 className="text-2xl font-bold text-white tracking-wide">About Figtop Markets</h1>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          Welcome to Figtop Markets, your premium institution for real-time portfolio tracking and live market infrastructure tools.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-600 font-mono">
          System Core Online • Production Build
        </div>
      </div>
    </div>
  );
}