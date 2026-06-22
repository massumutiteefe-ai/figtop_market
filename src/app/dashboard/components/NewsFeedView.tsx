'use strict';

import React, { useEffect, useState } from 'react';

interface CryptoNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
}

const fallbackCalendar = [
  { time: "08:30 AM", currency: "USD", impact: "High", title: "Core Retail Sales m/m", actual: "0.4%", forecast: "0.2%" },
  { time: "09:45 AM", currency: "EUR", impact: "Medium", title: "French Flash Manufacturing PMI", actual: "47.2", forecast: "48.0" }
];

export default function NewsFeedView() {
  const [cryptoNews, setCryptoNews] = useState<CryptoNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCryptoNews() {
      try {
        // Pulls dynamic global asset updates anonymously
        const res = await fetch('https://coingecko.com');
        const data = await res.json();
        if (data && data.data) {
          setCryptoNews(data.data.slice(0, 5));
        }
      } catch (err) {
        console.log("Crypto news streaming error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCryptoNews();
  }, []);

  return (
    <div className="space-y-6">
      {/* TOP COMPONENT: ECONOMIC CALENDAR ROW */}
      <div className="bg-[#1a2238] rounded-xl p-4 border border-gray-800/40 overflow-x-auto">
        <div className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-4 px-1">Forex Factory Live Calendar Feed</div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-mono uppercase text-[10px]">
              <th className="pb-3 px-2 font-semibold">Time</th>
              <th className="pb-3 font-semibold">Currency</th>
              <th className="pb-3 font-semibold">Impact</th>
              <th className="pb-3 font-semibold">Economic News Event Parameters</th>
              <th className="pb-3 text-right font-semibold">Actual</th>
              <th className="pb-3 text-right font-semibold">Forecast</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {fallbackCalendar.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#0f162e]/40 transition">
                <td className="py-3 px-2 font-mono text-gray-300">{item.time}</td>
                <td className="py-3 font-bold text-gray-200">{item.currency}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${item.impact === 'High' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'}`}>{item.impact}</span>
                </td>
                <td className="py-3 text-gray-300">{item.title}</td>
                <td className="py-3 text-right font-mono font-bold text-green-400">{item.actual}</td>
                <td className="py-3 text-right font-mono text-gray-400">{item.forecast}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOTTOM COMPONENT: LIVE GLOBAL CRYPTO NEWS HEADLINES FEED */}
      <div className="bg-[#1a2238] rounded-xl p-5 border border-gray-800/40">
        <div className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-4 border-b border-gray-800 pb-2">🔴 Live World Asset & Crypto Market Sentiment News</div>
        
        {loading ? (
          <div className="text-xs font-mono text-gray-500 animate-pulse py-4">Connecting live news pipeline data channels...</div>
        ) : cryptoNews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cryptoNews.map((news) => (
              <a href={news.url} target="_blank" rel="noopener noreferrer" key={news.id} className="group block p-3 bg-[#0f162e]/40 rounded-lg border border-transparent hover:border-gray-700 transition">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-sm font-semibold text-gray-200 group-hover:text-orange-400 transition-colors">{news.title}</h4>
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono whitespace-nowrap">{news.source}</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2 font-mono">Published: {new Date(news.published_at).toLocaleString()}</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500 font-mono py-2">Global aggregate sentiment feed temporarily offline. Please refresh.</div>
        )}
      </div>
    </div>
  );
}