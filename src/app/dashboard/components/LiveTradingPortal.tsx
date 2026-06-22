"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const MARKET_CATEGORIES = {
  Indices: [
    { name: "US 500", symbol: "SP:SPX" },
    { name: "US 100", symbol: "NASDAQ:NDX" },
    { name: "US 30", symbol: "TVC:DJI" },
  ],

  Forex: [
    { name: "EURUSD", symbol: "OANDA:EURUSD" },
    { name: "GBPUSD", symbol: "OANDA:GBPUSD" },
    { name: "USDJPY", symbol: "OANDA:USDJPY" },
    { name: "AUDUSD", symbol: "OANDA:AUDUSD" },
    { name: "USDCHF", symbol: "OANDA:USDCHF" },
    { name: "USDCAD", symbol: "OANDA:USDCAD" },
  ],

  Crypto: [
    { name: "BTCUSD", symbol: "BINANCE:BTCUSDT" },
    { name: "ETHUSD", symbol: "BINANCE:ETHUSDT" },
    { name: "SOLUSD", symbol: "BINANCE:SOLUSDT" },
    { name: "BNBUSD", symbol: "BINANCE:BNBUSDT" },
    { name: "XRPUSD", symbol: "BINANCE:XRPUSDT" },
  ],

  Commodities: [
    { name: "Gold", symbol: "OANDA:XAUUSD" },
    { name: "Silver", symbol: "OANDA:XAGUSD" },
    { name: "US Oil", symbol: "TVC:USOIL" },
    { name: "Brent", symbol: "TVC:UKOIL" },
  ],

  Stocks: [
    { name: "Apple", symbol: "NASDAQ:AAPL" },
    { name: "Tesla", symbol: "NASDAQ:TSLA" },
    { name: "Nvidia", symbol: "NASDAQ:NVDA" },
    { name: "Microsoft", symbol: "NASDAQ:MSFT" },
    { name: "Amazon", symbol: "NASDAQ:AMZN" },
  ],
};

export default function LiveTradingPortal() {
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedSymbol, setSelectedSymbol] =
    useState("BINANCE:BTCUSDT");

  const [activeCategory, setActiveCategory] =
    useState("Crypto");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const createWidget = () => {
      if (!window.TradingView || !chartRef.current) return;

      chartRef.current.innerHTML = "";

      new window.TradingView.widget({
        autosize: true,
        symbol: selectedSymbol,
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: true,
        withdateranges: true,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        save_image: true,
        enable_publishing: false,
        container_id: "tradingview_chart",
      });
    };

    if (!document.getElementById("tv-script")) {
      const script = document.createElement("script");

      script.id = "tv-script";
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;

      document.body.appendChild(script);
    } else {
      createWidget();
    }
  }, [selectedSymbol]);

  const symbols =
    MARKET_CATEGORIES[
      activeCategory as keyof typeof MARKET_CATEGORIES
    ].filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">

      {/* LEFT SIDEBAR */}

      <div className="w-[340px] border-r border-zinc-800 flex flex-col">

        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold">
            FIGTOP MARKETS
          </h1>
        </div>

        <div className="p-3 border-b border-zinc-800">
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Symbol..."
            className="
              w-full
              bg-zinc-900
              border
              border-zinc-700
              rounded
              px-3
              py-2
              outline-none
            "
          />
        </div>

        <div className="flex border-b border-zinc-800 overflow-x-auto">
          {Object.keys(MARKET_CATEGORIES).map(
            (category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`px-4 py-3 whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-zinc-800"
                    : ""
                }`}
              >
                {category}
              </button>
            )
          )}
        </div>

        <div className="flex-1 overflow-y-auto">

          {symbols.map((item) => (
            <button
              key={item.symbol}
              onClick={() =>
                setSelectedSymbol(item.symbol)
              }
              className={`w-full text-left p-4 border-b border-zinc-900 hover:bg-zinc-900 transition ${
                selectedSymbol === item.symbol
                  ? "bg-zinc-800"
                  : ""
              }`}
            >
              <div className="font-semibold">
                {item.name}
              </div>

              <div className="text-xs text-zinc-400">
                {item.symbol}
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* FULL CHART AREA */}

      <div className="flex-1 h-full">

        <div
          id="tradingview_chart"
          ref={chartRef}
          className="w-full h-full"
        />

      </div>

    </div>
  );
}