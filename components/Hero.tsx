"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

export default function Hero() {
  const { isConnected } = useAccount();

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 font-display">
              <span className="gradient-text">Deploy Arbitrage Bots.</span>
              <br />
              <span className="text-white">Capture Alpha 24/7.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0">
              6 market-neutral strategies running on Sepolia.
              <br />
              Zero directional risk. Institutional-grade execution.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isConnected ? (
                <a
                  href="/dashboard"
                  className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
                >
                  Launch Dashboard →
                </a>
              ) : (
                <div className="flex items-center">
                  <ConnectKitButton />
                </div>
              )}
              <a
                href="#strategies"
                className="px-8 py-4 text-base font-semibold text-text-primary bg-transparent border border-border rounded-full hover:border-emerald-500/50 hover:bg-bg-card/80 transition-all duration-300"
              >
                View Strategies
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-bg-primary" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 border-2 border-bg-primary" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-bg-primary" />
                </div>
                <span>500+ traders</span>
              </div>
              <span className="text-text-muted">•</span>
              <span>$2.4M+ volume</span>
              <span className="text-text-muted">•</span>
              <span>6 strategies live</span>
            </div>
          </div>

          {/* Right - Live Bot Activity Widget */}
          <div className="relative">
            <LiveBotActivity />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

// Live Bot Activity Widget
function LiveBotActivity() {
  const [trades, setTrades] = useState<Array<{
    time: string;
    strategy: string;
    asset: string;
    pnl: number;
  }>>([
    { time: '10:42:15', strategy: 'CROSS_SOL', asset: 'SOL', pnl: 12.34 },
    { time: '10:40:08', strategy: 'MM_LINK', asset: 'LINK', pnl: 8.21 },
    { time: '10:38:22', strategy: 'BETA_AVAX', asset: 'AVAX', pnl: -2.15 },
    { time: '10:36:45', strategy: 'CROSS_MATIC', asset: 'MATIC', pnl: 5.67 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const strategies = ['CROSS_SOL', 'MM_LINK', 'BETA_AVAX', 'CROSS_MATIC', 'MM_SOL', 'MM_AVAX'];
      const assets = ['SOL', 'LINK', 'AVAX', 'MATIC'];
      const newTrade = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        strategy: strategies[Math.floor(Math.random() * strategies.length)],
        asset: assets[Math.floor(Math.random() * assets.length)],
        pnl: +(Math.random() * 20 - 2).toFixed(2),
      };
      setTrades(prev => [newTrade, ...prev].slice(0, 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-bot-widget">
      <div className="widget-header">
        <span className="pulse-dot" />
        <span className="text-sm font-semibold text-text-primary">Live Bot Activity</span>
      </div>
      <div className="divide-y divide-border">
        {trades.map((trade, i) => (
          <div key={i} className="trade-row">
            <span className="trade-time">{trade.time}</span>
            <span className="trade-strategy">{trade.strategy}</span>
            <span className="trade-asset">{trade.asset}</span>
            <span className={trade.pnl > 0 ? 'pnl-positive' : 'pnl-negative'}>
              {trade.pnl > 0 ? '+' : ''}${trade.pnl}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
