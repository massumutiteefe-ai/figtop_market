'use client';

import React, { useState } from 'react';
import BotPackagesView from './BotPackagesView';
// Note: MarketsChartView import has been removed as it is no longer required

const API = "http://localhost/figtop-api";

export default function TradingDesk() {
  const [mainTab, setMainTab] = useState<'market' | 'news'>('market');

  return (
    <div className="bg-[#0f162e] p-6 rounded-lg text-white space-y-6 select-none animate-fadeIn">
      
      {/* LEVEL 1: MAIN NAVIGATION BUTTON BAR (MARKET | NEWS) */}
      <div className="flex gap-6 border-b border-gray-800 pb-2">
        <button
          onClick={() => setMainTab('market')}
          className={`text-lg font-bold uppercase tracking-wider transition-all ${
            mainTab === 'market' ? 'text-orange-500 border-b-2 border-orange-500 pb-2' : 'text-gray-400 hover:text-white pb-2'
          }`}
        >
          MARKET
        </button>
        <button
          onClick={() => setMainTab('news')}
          className={`text-lg font-bold uppercase tracking-wider transition-all ${
            mainTab === 'news' ? 'text-orange-500 border-b-2 border-orange-500 pb-2' : 'text-gray-400 hover:text-white pb-2'
          }`}
        >
          NEWS
        </button>
      </div>

      {/* LEVEL 2: DYNAMIC CONDITIONAL DISPATCH VIEW */}
      {mainTab === 'market' ? (
        <div className="space-y-6">
          
          {/* STATIC SINGLE-SELECTION TRACK: Extra categories hidden cleanly */}
          <div className="bg-[#1a2238] p-1.5 rounded-xl flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest pl-3 text-orange-400">
              Active Investment Gateway
            </span>
            <span className="bg-orange-600 text-white py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wide">
              AI Bot Package
            </span>
          </div>

          {/* DYNAMIC OPERATION CONTENT MATRIX FLOOR */}
          <BotPackagesView apiEndpoint={API} />
          
        </div>
      ) : (
        /* Render news baseline updates safely when selected */
        <div className="text-center text-xs text-gray-500 py-12 border border-dashed border-gray-800 rounded-xl">
          Global macroeconomic asset feeds synchronized. No active news notifications broadcasted.
        </div>
      )}

    </div>
  );
}