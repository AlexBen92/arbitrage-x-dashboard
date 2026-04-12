"use client";

import { useState } from "react";
import { demoBotsConfig, rarityColors } from "@/lib/landingConfig";

export default function DemoSection() {
  const [selectedBots, setSelectedBots] = useState<typeof demoBotsConfig>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLineup = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Pick 3 random bots
      const shuffled = [...demoBotsConfig].sort(() => Math.random() - 0.5);
      setSelectedBots(shuffled.slice(0, 3));
      setIsGenerating(false);
    }, 800);
  };

  const calculateTotalScore = () => {
    return selectedBots.reduce((acc, bot) => acc + bot.score, 0);
  };

  return (
    <section id="demo" className="py-20 md:py-32 bg-crypto-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
            Démo instantanée
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Génère une line-up de démo en 1 clic. Pas d&apos;inscription, pas de wallet.
          </p>
        </div>

        {/* Generate button */}
        <div className="text-center mb-12">
          <button
            onClick={generateLineup}
            disabled={isGenerating}
            className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-500 rounded-full hover:from-primary-500 hover:to-accent-400 transition-all duration-300 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Génération...
              </span>
            ) : (
              "🎴 Générer ma line-up de démo"
            )}
          </button>
        </div>

        {/* Generated cards */}
        {selectedBots.length > 0 && (
          <div className="max-w-5xl mx-auto">
            {/* Line-up header */}
            <div className="bg-crypto-card border border-crypto-border rounded-2xl p-6 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Ta line-up de démo
                </h3>
                <p className="text-sm text-gray-400">
                  Score total:{" "}
                  <span className="text-primary-400 font-bold">
                    {calculateTotalScore()}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Saison 0</p>
                <p className="text-xs text-gray-600">Simulation</p>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {selectedBots.map((bot) => (
                <div
                  key={bot.id}
                  className={`relative bg-gradient-to-br ${rarityColors[bot.rarity as keyof typeof rarityColors]} border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  {/* Rarity badge */}
                  <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/50 text-white backdrop-blur-sm">
                    {bot.rarity}
                  </div>

                  {/* Bot icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4">
                    🤖
                  </div>

                  {/* Bot info */}
                  <h4 className="text-lg font-bold text-white mb-1">
                    {bot.name}
                  </h4>
                  <p className="text-xs text-white/70 mb-4">{bot.type}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-black/30 rounded-lg p-2">
                      <p className="text-xs text-white/50 uppercase">PnL</p>
                      <p className="text-base font-bold text-green-400">
                        {bot.pnl}
                      </p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2">
                      <p className="text-xs text-white/50 uppercase">Score</p>
                      <p className="text-base font-bold text-white">
                        {bot.score}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/70 line-clamp-2">
                    {bot.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500 mb-4">
                C&apos;est une démo. La vraie saison arrive avec de vrais bots et de vrais rewards.
              </p>
              <a
                href="#waitlist"
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-primary-600 rounded-full hover:bg-primary-500 transition-colors"
              >
                Réserver ma place pour la saison 0 →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
