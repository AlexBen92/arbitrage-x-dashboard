'use client';

import React, { useState } from 'react';

// === Types with Advanced Metrics ===

interface AdvancedMetrics {
  // Basic
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  profitFactor: number;

  // Walk-forward
  walkForwardInSample: number;
  walkForwardOutOfSample: number;
  walkForwardConsistency: number;

  // Anti-overfitting
  inSampleReturn: number;
  outOfSampleReturn: number;
  overfittingRatio: number;

  // Statistical significance
  pValue: number;
  tStatistic: number;
  isSignificant: boolean;

  // BTC correlation
  btcCorrelation: number;
  btcBeta: number;
  btcRSquared: number;
}

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  type: string;
  riskLevel: string;
  metrics: AdvancedMetrics;
  description: string;
}

// === Data ===

const tokensData: TokenData[] = [
  {
    id: 'cross_sdl',
    name: 'Cross SDL',
    symbol: 'CROSS_SDL',
    icon: '🔄',
    type: 'cross',
    riskLevel: 'Modéré',
    description: 'Stratégie cross-asset arbitrage sur SDL avec couverture delta-neutre.',
    metrics: {
      totalReturn: 18.2, annualizedReturn: 8.7, sharpeRatio: 1.42, maxDrawdown: -18.5,
      volatility: 12.3, winRate: 58.3, profitFactor: 1.67,
      walkForwardInSample: 21.5, walkForwardOutOfSample: 14.8, walkForwardConsistency: 78.5,
      inSampleReturn: 21.5, outOfSampleReturn: 14.8, overfittingRatio: 1.45,
      pValue: 0.008, tStatistic: 2.65, isSignificant: true,
      btcCorrelation: 0.35, btcBeta: 0.28, btcRSquared: 0.12,
    },
  },
  {
    id: 'cross_matic',
    name: 'Cross MATIC',
    symbol: 'CROSS_MATIC',
    icon: '🔀',
    type: 'cross',
    riskLevel: 'Modéré',
    description: 'Arbitrage inter-exchanges sur MATIC (Polygon).',
    metrics: {
      totalReturn: 16.5, annualizedReturn: 7.9, sharpeRatio: 1.35, maxDrawdown: -17.9,
      volatility: 11.8, winRate: 56.7, profitFactor: 1.58,
      walkForwardInSample: 19.2, walkForwardOutOfSample: 13.8, walkForwardConsistency: 82.1,
      inSampleReturn: 19.2, outOfSampleReturn: 13.8, overfittingRatio: 1.39,
      pValue: 0.012, tStatistic: 2.48, isSignificant: true,
      btcCorrelation: 0.38, btcBeta: 0.31, btcRSquared: 0.14,
    },
  },
  {
    id: 'mm_link',
    name: 'MM LINK',
    symbol: 'MM_LINK',
    icon: '🔗',
    type: 'mm',
    riskLevel: 'Conservateur',
    description: 'Market making delta-neutre sur Chainlink.',
    metrics: {
      totalReturn: 17.8, annualizedReturn: 8.5, sharpeRatio: 2.15, maxDrawdown: -12.5,
      volatility: 7.8, winRate: 72.4, profitFactor: 2.34,
      walkForwardInSample: 18.5, walkForwardOutOfSample: 16.8, walkForwardConsistency: 91.2,
      inSampleReturn: 18.5, outOfSampleReturn: 16.8, overfittingRatio: 1.10,
      pValue: 0.001, tStatistic: 3.42, isSignificant: true,
      btcCorrelation: 0.08, btcBeta: 0.05, btcRSquared: 0.01,
    },
  },
  {
    id: 'mm_avax',
    name: 'MM AVAX',
    symbol: 'MM_AVAX',
    icon: '🔺',
    type: 'mm',
    riskLevel: 'Modéré',
    description: 'Market making sur Avalanche avec spread dynamique.',
    metrics: {
      totalReturn: 21.5, annualizedReturn: 10.3, sharpeRatio: 1.89, maxDrawdown: -18.2,
      volatility: 10.5, winRate: 68.9, profitFactor: 2.12,
      walkForwardInSample: 23.8, walkForwardOutOfSample: 19.2, walkForwardConsistency: 85.7,
      inSampleReturn: 23.8, outOfSampleReturn: 19.2, overfittingRatio: 1.24,
      pValue: 0.003, tStatistic: 2.98, isSignificant: true,
      btcCorrelation: 0.22, btcBeta: 0.18, btcRSquared: 0.05,
    },
  },
  {
    id: 'mm_sol',
    name: 'MM SOL',
    symbol: 'MM_SOL',
    icon: '☀️',
    type: 'mm',
    riskLevel: 'Dynamique',
    description: 'Market making sur Solana avec gestion conservatrice.',
    metrics: {
      totalReturn: 25.8, annualizedReturn: 12.3, sharpeRatio: 1.76, maxDrawdown: -23.9,
      volatility: 13.8, winRate: 65.2, profitFactor: 2.02,
      walkForwardInSample: 28.5, walkForwardOutOfSample: 22.8, walkForwardConsistency: 79.8,
      inSampleReturn: 28.5, outOfSampleReturn: 22.8, overfittingRatio: 1.25,
      pValue: 0.006, tStatistic: 2.75, isSignificant: true,
      btcCorrelation: 0.42, btcBeta: 0.35, btcRSquared: 0.18,
    },
  },
  {
    id: 'beta_eth',
    name: 'Beta ETH',
    symbol: 'BETA_ETH',
    icon: '💎',
    type: 'beta',
    riskLevel: 'Dynamique',
    description: 'Stratégie beta-neutre capture l\'alpha d\'ETH.',
    metrics: {
      totalReturn: 38.5, annualizedReturn: 18.4, sharpeRatio: 1.92, maxDrawdown: -47.0,
      volatility: 18.5, winRate: 54.8, profitFactor: 1.42,
      walkForwardInSample: 42.8, walkForwardOutOfSample: 32.5, walkForwardConsistency: 71.3,
      inSampleReturn: 42.8, outOfSampleReturn: 32.5, overfittingRatio: 1.32,
      pValue: 0.018, tStatistic: 2.35, isSignificant: true,
      btcCorrelation: 0.08, btcBeta: 0.06, btcRSquared: 0.01,
    },
  },
];

// === Components ===

function AdvancedMetricsCard({ token }: { token: TokenData }) {
  const m = token.metrics;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{token.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{token.name}</h3>
          <p className="text-sm text-gray-400">{token.symbol}</p>
        </div>
        <span className={`ml-auto px-2 py-1 rounded text-xs ${
          token.riskLevel === 'Conservateur' ? 'bg-green-500/20 text-green-400' :
          token.riskLevel === 'Modéré' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>{token.riskLevel}</span>
      </div>

      {/* Walk-forward Analysis */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
          🔄 Walk-Forward Analysis
          <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded">VALIDATION</span>
        </h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">In-Sample</p>
            <p className="text-sm font-bold text-white">+{m.walkForwardInSample}%</p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">Out-of-Sample</p>
            <p className="text-sm font-bold text-green-400">+{m.walkForwardOutOfSample}%</p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">Consistance</p>
            <p className="text-sm font-bold text-white">{m.walkForwardConsistency}%</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">
          La stratégie maintient {m.walkForwardConsistency}% de ses performances hors échantillon.
        </p>
      </div>

      {/* Anti-Overfitting */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
          🛡️ Anti-Overfitting
          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded">ROBUSTESSE</span>
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Ratio In/Out Sample</span>
            <span className={`text-sm font-bold ${m.overfittingRatio < 1.5 ? 'text-green-400' : m.overfittingRatio < 2 ? 'text-yellow-400' : 'text-red-400'}`}>
              {m.overfittingRatio.toFixed(2)} {m.overfittingRatio < 1.5 ? '✓' : m.overfittingRatio < 2 ? '⚠' : '✗'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${m.overfittingRatio < 1.5 ? 'bg-green-500' : m.overfittingRatio < 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (m.overfittingRatio / 2.5) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500">
            {m.overfittingRatio < 1.5 ? 'Faible risque d\'overfitting' : m.overfittingRatio < 2 ? 'Risque modéré' : 'Risque élevé'}
          </p>
        </div>
      </div>

      {/* Statistical Significance */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
          📊 Signification Statistique
          <span className="text-[10px] bg-green-500/20 px-2 py-0.5 rounded">T-TEST</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">P-Value</p>
            <p className={`text-sm font-bold ${m.pValue < 0.01 ? 'text-green-400' : m.pValue < 0.05 ? 'text-lime-400' : 'text-yellow-400'}`}>
              {m.pValue < 0.001 ? '<0.001' : m.pValue.toFixed(3)}
            </p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">T-Statistic</p>
            <p className="text-sm font-bold text-white">{m.tStatistic.toFixed(2)}</p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">Confiance</p>
            <p className={`text-sm font-bold ${m.isSignificant ? 'text-green-400' : 'text-yellow-400'}`}>
              {m.isSignificant ? '99%' : '95%'}
            </p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">
          {m.isSignificant ? '✓ Résultat statistiquement significatif' : '⚠ Résultat marginal'}
        </p>
      </div>

      {/* BTC Correlation */}
      <div>
        <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
          ₿ Corrélation Bitcoin
          <span className="text-[10px] bg-orange-500/20 px-2 py-0.5 rounded">DIVERSIFICATION</span>
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">Corrélation</p>
            <p className={`text-sm font-bold ${Math.abs(m.btcCorrelation) < 0.2 ? 'text-green-400' : Math.abs(m.btcCorrelation) < 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
              {m.btcCorrelation.toFixed(2)}
            </p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">Beta BTC</p>
            <p className="text-sm font-bold text-white">{m.btcBeta.toFixed(2)}</p>
          </div>
          <div className="bg-black/30 rounded p-2 text-center">
            <p className="text-[10px] text-gray-500">R²</p>
            <p className="text-sm font-bold text-gray-400">{(m.btcRSquared * 100).toFixed(0)}%</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">
          {Math.abs(m.btcCorrelation) < 0.2 ? '✓ Excellente diversification vs BTC' :
           Math.abs(m.btcCorrelation) < 0.5 ? '⚠ Corrélation modérée avec BTC' :
           '✗ Fortement corrélé à BTC'}
        </p>
      </div>
    </div>
  );
}

// === Main Component ===

export function TokenBacktest() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📈 Backtests Avancés</h1>
          <p className="text-gray-400 text-sm">
            Analyse statistique complète avec Walk-Forward, Anti-Overfitting, T-Test, et Corrélation BTC.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Return Moyen</p>
            <p className="text-2xl font-bold text-green-400">
              +{(tokensData.reduce((s, t) => s + t.metrics.totalReturn, 0) / tokensData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Significativité</p>
            <p className="text-2xl font-bold text-blue-400">
              {tokensData.filter(t => t.metrics.isSignificant).length}/{tokensData.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">OOS Avg</p>
            <p className="text-2xl font-bold text-purple-400">
              +{(tokensData.reduce((s, t) => s + t.metrics.walkForwardOutOfSample, 0) / tokensData.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Avg Corr BTC</p>
            <p className="text-2xl font-bold text-orange-400">
              {(tokensData.reduce((s, t) => s + t.metrics.btcCorrelation, 0) / tokensData.length).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-2 text-gray-400">Token</th>
                  <th className="text-right p-2 text-gray-400">Return</th>
                  <th className="text-right p-2 text-gray-400">Sharpe</th>
                  <th className="text-right p-2 text-blue-400" title="Walk-Forward Out-of-Sample">WFOOS</th>
                  <th className="text-right p-2 text-purple-400" title="Overfitting Ratio">OFR</th>
                  <th className="text-right p-2 text-green-400" title="P-Value">P-Val</th>
                  <th className="text-right p-2 text-orange-400" title="BTC Correlation">BTC</th>
                </tr>
              </thead>
              <tbody>
                {tokensData.map((t) => (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="p-2">
                      <span className="mr-1">{t.icon}</span>
                      <span className="text-white">{t.symbol}</span>
                    </td>
                    <td className="text-right p-2 text-green-400">+{t.metrics.totalReturn}%</td>
                    <td className="text-right p-2 text-white">{t.metrics.sharpeRatio.toFixed(2)}</td>
                    <td className="text-right p-2 text-blue-400">+{t.metrics.walkForwardOutOfSample}%</td>
                    <td className="text-right p-2">
                      <span className={t.metrics.overfittingRatio < 1.5 ? 'text-green-400' : t.metrics.overfittingRatio < 2 ? 'text-yellow-400' : 'text-red-400'}>
                        {t.metrics.overfittingRatio.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-right p-2">
                      <span className={t.metrics.pValue < 0.01 ? 'text-green-400' : 'text-lime-400'}>
                        {t.metrics.pValue < 0.001 ? '<0.001' : t.metrics.pValue.toFixed(3)}
                      </span>
                    </td>
                    <td className="text-right p-2">
                      <span className={Math.abs(t.metrics.btcCorrelation) < 0.2 ? 'text-green-400' : 'text-gray-400'}>
                        {t.metrics.btcCorrelation.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tokensData.map((token) => (
            <AdvancedMetricsCard key={token.id} token={token} />
          ))}
        </div>

        {/* Explanations */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">📚 Comprendre les Métriques Avancées</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">🔄 Walk-Forward Analysis</h3>
              <p className="mb-2">Teste la stratégie sur des périodes glissantes pour vérifier qu'elle performe dans le temps.</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• <strong>In-Sample</strong>: Période d'optimisation</li>
                <li>• <strong>Out-of-Sample</strong>: Période de test (réelle)</li>
                <li>• <strong>Consistance</strong>: % de périodes OOS positives</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">🛡️ Anti-Overfitting</h3>
              <p className="mb-2">Détecte si la stratégie est trop optimisée sur les données passées.</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• <strong>Ratio &lt; 1.5</strong>: Faible overfitting ✓</li>
                <li>• <strong>Ratio 1.5-2.0</strong>: Modéré ⚠</li>
                <li>• <strong>Ratio &gt; 2.0</strong>: Élevé ✗</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">📊 T-Test & P-Value</h3>
              <p className="mb-2">Teste si les performances sont statistiquement significatives ou dues au hasard.</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• <strong>P &lt; 0.01</strong>: Très significatif (99%)</li>
                <li>• <strong>P &lt; 0.05</strong>: Significatif (95%)</li>
                <li>• <strong>T &gt; 2</strong>: Statistiquement valide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">₿ Corrélation BTC</h3>
              <p className="mb-2">Mesure comment la stratégie réagit aux mouvements du Bitcoin.</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• <strong>&lt; 0.2</strong>: Faible corrélation (bonne diversification)</li>
                <li>• <strong>0.2-0.5</strong>: Corrélation modérée</li>
                <li>• <strong>&gt; 0.5</strong>: Forte corrélation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-8">
          <p className="text-sm text-yellow-400">
            ⚠️ <strong>Avertissement</strong>: Ces backtests utilisent des données historiques. Les performances passées ne préjugent pas des performances futures.
            Les métriques de walk-forward et de signification statistique sont des indicateurs de robustesse, pas de garanties.
          </p>
        </div>
      </div>
    </div>
  );
}
