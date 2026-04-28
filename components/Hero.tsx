"use client";

import { heroConfig, demoBotsConfig } from "@/lib/landingConfig";
import { useState } from "react";

export default function Hero() {
  const [featuredBot] = useState(demoBotsConfig[4]); // Contrarian Bandit - legendary

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-transparent to-crypto-darker" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{heroConfig.headline}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              {heroConfig.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#waitlist"
                className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 rounded-full hover:from-primary-500 hover:to-accent-400 transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105"
              >
                {heroConfig.ctaPrimary}
              </a>
              <a
                href="/dashboard"
                className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-500 rounded-full hover:from-blue-500 hover:to-purple-400 transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
              >
                🪙 Acheter des Tokens
              </a>
              <a
                href="#demo"
                className="px-8 py-4 text-base font-semibold text-gray-300 bg-crypto-card border border-crypto-border rounded-full hover:border-primary-500/50 hover:bg-crypto-card/80 transition-all duration-300"
              >
                {heroConfig.ctaSecondary}
              </a>
            </div>

            {/* Social proof mini */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 border-2 border-crypto-darker" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 border-2 border-crypto-darker" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-crypto-darker" />
                </div>
                <span>500+ joueurs en waitlist</span>
              </div>
            </div>
          </div>

          {/* Right - Card Preview */}
          <div className="relative hidden lg:block">
            <div className="animate-float">
              {/* Bot Card */}
              <div
                className={`relative bg-gradient-to-br ${featuredBot.rarity === "legendary" ? "from-amber-900/40 to-orange-900/40" : "from-crypto-card to-crypto-border"} border-2 ${
                  featuredBot.rarity === "legendary"
                    ? "border-amber-500/50"
                    : "border-crypto-border"
                } rounded-3xl p-6 shadow-2xl ${
                  featuredBot.rarity === "legendary"
                    ? "shadow-amber-500/20"
                    : "shadow-primary-500/10"
                }`}
              >
                {/* Rarity badge */}
                <div
                  className={`absolute -top-3 -right-3 px-4 py-1 rounded-full text-xs font-bold uppercase ${
                    featuredBot.rarity === "legendary"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      : "bg-crypto-card border border-crypto-border text-gray-400"
                  }`}
                >
                  {featuredBot.rarity}
                </div>

                {/* Bot icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl mb-4">
                  🤖
                </div>

                {/* Bot info */}
                <h3 className="text-2xl font-bold text-white mb-1">
                  {featuredBot.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{featuredBot.type}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-crypto-darker/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase">PnL</p>
                    <p className="text-xl font-bold text-green-400">
                      {featuredBot.pnl}
                    </p>
                  </div>
                  <div className="bg-crypto-darker/50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase">Score</p>
                    <p className="text-xl font-bold text-primary-400">
                      {featuredBot.score}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400">{featuredBot.description}</p>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 pointer-events-none" />
              </div>

              {/* Mini leaderboard preview */}
              <div className="absolute -bottom-4 -right-4 bg-crypto-card border border-crypto-border rounded-2xl p-4 shadow-xl">
                <p className="text-xs text-gray-500 uppercase mb-2">Top 3 Line-ups</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-300">@DegenWhale</span>
                    <span className="text-sm font-bold text-green-400">+234%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-300">@PerpKing</span>
                    <span className="text-sm font-bold text-green-400">+189%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-300">@FarmingApe</span>
                    <span className="text-sm font-bold text-green-400">+167%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-600"
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
