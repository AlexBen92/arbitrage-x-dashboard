'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

// === Données mockées ===

function getMarketData() {
  const ethPrice = 3200;
  const ethPriceBase = 3000;
  const squeethIndex = Math.pow(ethPrice / ethPriceBase, 2); // (ETH/3000)²

  // Prix théorique = 2 × variance × période
  // Variance typique = (50% vol)² = 0.25
  const variance = 0.25;
  const fundingPeriod = 1 / 24 / 365; // 1 heure en années
  const fairPrice = 2 * variance * fundingPeriod;

  // Le marché peut surcharger ou sous-charger
  const premium = (Math.random() - 0.4) * fairPrice * 0.4;
  const marketPrice = fairPrice + premium;

  return {
    ethPrice,
    ethChange24h: 3.2,
    squeethIndex,
    fairPrice,
    marketPrice,
    premium,
    premiumPercent: (premium / fairPrice) * 100,
    recommendation: premium > fairPrice * 0.1 ? 'sell' : premium < -fairPrice * 0.1 ? 'buy' : 'hold',
    confidence: Math.random() > 0.5 ? 'high' : 'medium',
  };
}

// === Composants ===

export function SimplePowerPerpDashboard() {
  const [data, setData] = useState(getMarketData());
  const [mode, setMode] = useState<'buy' | 'sell' | null>(null);
  const [amount, setAmount] = useState('1000');
  const { isConnected, address } = useAccount();

  useEffect(() => {
    const interval = setInterval(() => setData(getMarketData()), 10000);
    return () => clearInterval(interval);
  }, []);

  const isBuyMode = mode === 'buy';
  const isSellMode = mode === 'sell';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header simple */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">ETH² Arbitrage</h1>
            <p className="text-sm text-gray-400">Profitez des écarts de prix automatiquement</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-gray-300">
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Non connecté'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Section 1: L'opportunité en un coup d'œil */}
        <OpportunityBanner data={data} onSelectAction={setMode} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Colonne gauche: Le marché */}
          <div className="lg:col-span-2 space-y-6">
            <MarketCard data={data} />
            <ExplanationCard />
          </div>

          {/* Colonne droite: Action */}
          <div className="space-y-6">
            <ActionCard
              mode={mode}
              amount={amount}
              onModeChange={setMode}
              onAmountChange={setAmount}
              data={data}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// === BANNIÈRE D'OPPORTUNITÉ ===

interface OpportunityBannerProps {
  data: ReturnType<typeof getMarketData>;
  onSelectAction: (mode: 'buy' | 'sell' | null) => void;
}

function OpportunityBanner({ data, onSelectAction }: OpportunityBannerProps) {
  const isOpportunity = data.recommendation !== 'hold';
  const isSell = data.recommendation === 'sell';

  if (!isOpportunity) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-4">
          <span className="text-4xl">⏳</span>
          <div>
            <p className="text-xl font-semibold text-white">En attente d'opportunité</p>
            <p className="text-gray-400">Le marché est équilibré. Nous surveillons pour vous.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border-2 ${isSell ? 'bg-green-500/10 border-green-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{isSell ? '📉' : '📈'}</span>
          <div>
            <p className="text-xl font-semibold text-white">
              {isSell ? 'Prix trop haut - Vendre recommandé' : 'Prix bas - Acheter recommandé'}
            </p>
            <p className="text-gray-300">
              Écart: <span className={`font-semibold ${isSell ? 'text-green-400' : 'text-blue-400'}`}>
                {Math.abs(data.premiumPercent).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSelectAction('sell')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isSell
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Vendre
          </button>
          <button
            onClick={() => onSelectAction('buy')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !isSell
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Acheter
          </button>
        </div>
      </div>

      {/* Barre visuelle de l'opportunité */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Trop bas (acheter)</span>
          <span>Prix juste</span>
          <span>Trop haut (vendre)</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
          {/* Zone centrale = prix juste */}
          <div className="absolute left-1/3 right-1/3 h-full bg-gray-600/30" />
          {/* Indicateur actuel */}
          <div
            className={`absolute top-0 bottom-0 w-4 rounded-full transition-all duration-500 ${
              isSell ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{
              left: `${Math.min(95, Math.max(5, 50 + data.premiumPercent * 2))}%`,
              transform: 'translateX(-50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// === CARTE MARCHÉ ===

interface MarketCardProps {
  data: ReturnType<typeof getMarketData>;
}

function MarketCard({ data }: MarketCardProps) {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h2 className="text-lg font-semibold text-white mb-4">Le marché maintenant</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Prix ETH */}
        <div className="p-4 bg-black/30 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Prix Ethereum (ETH)</p>
          <p className="text-2xl font-bold text-white">{data.ethPrice.toFixed(0)} $</p>
          <p className={`text-sm mt-1 ${data.ethChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.ethChange24h >= 0 ? '+' : ''}{data.ethChange24h}% aujourd'hui
          </p>
        </div>

        {/* Prix ETH² */}
        <div className="p-4 bg-black/30 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Prix ETH² (Squeeth)</p>
          <p className="text-2xl font-bold text-white">{data.marketPrice.toFixed(6)}</p>
          <p className="text-sm text-gray-400 mt-1">
            Index: {data.squeethIndex.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Prix juste vs marché */}
      <div className="mt-4 p-4 bg-black/30 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Prix juste (calculé)</p>
            <p className="text-lg font-semibold text-white">{data.fairPrice.toFixed(6)}</p>
          </div>

          <div className="text-center">
            <p className={`text-2xl font-bold ${data.premium >= 0 ? 'text-red-400' : 'text-green-400'}`}>
              {data.premium >= 0 ? '+' : ''}{data.premiumPercent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">écart</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Prix marché</p>
            <p className="text-lg font-semibold text-white">{data.marketPrice.toFixed(6)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === CARTE EXPLICATION ===

function ExplanationCard() {
  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
      <h2 className="text-lg font-semibold text-white mb-4">Comment ça marche ?</h2>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 font-semibold">1</span>
          </div>
          <div>
            <p className="font-medium text-white">C'est quoi ETH² ?</p>
            <p className="text-sm text-gray-400 mt-1">
              Un produit qui suit le carré du prix Ethereum. Si ETH ×2, ETH² ×4. Si ETH ×3, ETH² ×9.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-semibold">2</span>
          </div>
          <div>
            <p className="font-medium text-white">Pourquoi ça s'arbitre ?</p>
            <p className="text-sm text-gray-400 mt-1">
              Le prix théorique est calculé avec la volatilité. Quand le marché s'éloigne de ce prix,
              il y a une opportunité de profit.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-semibold">3</span>
          </div>
          <div>
            <p className="font-medium text-white">Comment profiter ?</p>
            <p className="text-sm text-gray-400 mt-1">
              <strong>Achetez</strong> quand le prix est bas, <strong>vendez</strong> quand il est haut.
              Notre algorithme détecte automatiquement les meilleurs moments.
            </p>
          </div>
        </div>
      </div>

      {/* Exemple visuel */}
      <div className="mt-4 p-4 bg-black/30 rounded-xl">
        <p className="text-sm font-medium text-white mb-3">📊 Exemple:</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl mb-1">📈</p>
            <p className="text-xs text-gray-400">ETH passe de</p>
            <p className="font-mono text-white">3000$ → 3300$</p>
          </div>
          <div>
            <p className="text-2xl mb-1">📈</p>
            <p className="text-xs text-gray-400">ETH² passe de</p>
            <p className="font-mono text-white">1.00 → 1.21</p>
          </div>
          <div>
            <p className="text-2xl mb-1">💰</p>
            <p className="text-xs text-gray-400">Gain si long</p>
            <p className="font-mono text-green-400">+21%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === CARTE ACTION ===

interface ActionCardProps {
  mode: 'buy' | 'sell' | null;
  amount: string;
  onModeChange: (mode: 'buy' | 'sell' | null) => void;
  onAmountChange: (amount: string) => void;
  data: ReturnType<typeof getMarketData>;
}

function ActionCard({ mode, amount, onModeChange, onAmountChange, data }: ActionCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!mode) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Que faire ?</h2>
        <p className="text-gray-400 mb-6">
          Sélectionnez une opportunité ci-dessus ou choisissez une action:
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onModeChange('buy')}
            className="w-full p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-400">Acheter ETH²</p>
                <p className="text-sm text-gray-400">Parier sur la hausse de volatilité</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
          </button>

          <button
            onClick={() => onModeChange('sell')}
            className="w-full p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl text-left transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-green-400">Vendre ETH²</p>
                <p className="text-sm text-gray-400">Parier sur la baisse de volatilité</p>
              </div>
              <span className="text-2xl">📉</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const isBuy = mode === 'buy';
  const amountNum = parseFloat(amount) || 0;
  const estimatedContracts = amountNum / data.marketPrice;

  return (
    <div className={`p-6 rounded-2xl border-2 ${isBuy ? 'bg-blue-500/10 border-blue-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {isBuy ? 'Acheter' : 'Vendre'} ETH²
        </h2>
        <button
          onClick={() => onModeChange(null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Montant */}
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">Montant en $</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl text-2xl font-bold text-white focus:outline-none focus:border-white/30"
            placeholder="1000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">USD</span>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mt-3">
          {['100', '500', '1000', '5000'].map((val) => (
            <button
              key={val}
              onClick={() => onAmountChange(val)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
            >
              ${val}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="mb-6 p-4 bg-black/30 rounded-xl space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Prix unitaire</span>
          <span className="font-mono text-white">{data.marketPrice.toFixed(6)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quantité ETH²</span>
          <span className="font-mono text-white">{estimatedContracts.toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Coût total</span>
          <span className="font-mono text-white">${amountNum.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-white/10">
          <span className="text-gray-400">Écart vs prix juste</span>
          <span className={`font-mono ${data.premium >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {data.premium >= 0 ? '+' : ''}{data.premiumPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Bouton action */}
      <button
        onClick={() => setShowConfirm(true)}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isBuy
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
        }`}
      >
        {isBuy ? '📈 Acheter maintenant' : '📉 Vendre maintenant'}
      </button>

      {/* Info gas */}
      <p className="text-xs text-gray-500 text-center mt-3">
        ≈ $2-5 de frais de transaction (gas)
      </p>

      {/* Modal confirmation */}
      {showConfirm && (
        <ConfirmationModal
          isBuy={isBuy}
          amount={amount}
          contracts={estimatedContracts}
          price={data.marketPrice}
          onConfirm={() => {
            setShowConfirm(false);
            // Ici: exécuter la transaction
            alert('Transaction simulée! En production, cela déclencherait la transaction Web3.');
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

// === MODALE CONFIRMATION ===

interface ConfirmationModalProps {
  isBuy: boolean;
  amount: string;
  contracts: number;
  price: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({ isBuy, amount, contracts, price, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Confirmer la transaction
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-gray-400">Action</span>
            <span className={`font-semibold ${isBuy ? 'text-blue-400' : 'text-green-400'}`}>
              {isBuy ? 'ACHETER' : 'VENDRE'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-gray-400">Montant</span>
            <span className="font-mono text-white">${amount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-gray-400">Quantité ETH²</span>
            <span className="font-mono text-white">{contracts.toFixed(4)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-gray-400">Prix unitaire</span>
            <span className="font-mono text-white">{price.toFixed(6)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Frais estimés</span>
            <span className="font-mono text-white">~$3.00</span>
          </div>
        </div>

        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-6">
          <p className="text-sm text-yellow-400">
            ⚠️ Cette action nécessite une signature dans votre wallet.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              isBuy
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
