'use client';

import { SimplePowerPerpDashboard } from '@/components/power-perp';
import { HedgedTokensDashboard } from '@/components/hedged-tokens';
import { useState } from 'react';

export default function DashboardPage() {
  const [mode, setMode] = useState<'hedged' | 'squeeth'>('hedged');

  return (
    <div>
      {/* Mode Toggle */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-gray-900/90 backdrop-blur border border-white/10 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setMode('hedged')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'hedged'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hedged Tokens
          </button>
          <button
            onClick={() => setMode('squeeth')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'squeeth'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ETH² Arbitrage
          </button>
        </div>
      </div>

      {mode === 'hedged' ? <HedgedTokensDashboard /> : <SimplePowerPerpDashboard />}
    </div>
  );
}
