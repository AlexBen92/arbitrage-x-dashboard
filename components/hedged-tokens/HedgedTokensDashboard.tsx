'use client';

import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { HEDGED_TOKENS, HEDGED_TOKENS_BY_TYPE, type HedgedToken, type TokenId } from '@/lib/config/hedgedTokens';
import { useAllTokensNAV, useTokenNAV, useUSDCBalance, useMintWithApproval } from '@/lib/web3/hedgedTokensHooks';
import { isSupportedChain } from '@/lib/web3/wagmiConfig';

// === Subcomponents ===

function NetworkWarning() {
  const { chain } = useAccount();

  if (!chain || chain.id !== 11155111) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-400">Réseau incorrect</p>
            <p className="text-sm text-gray-300">
              Veuillez vous connecter à Sepolia Testnet pour accéder aux tokens.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function WalletWarning() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👛</span>
          <div>
            <p className="font-semibold text-blue-400">Wallet non connecté</p>
            <p className="text-sm text-gray-300">
              Connectez votre wallet pour interagir avec les tokens.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function BalanceCard() {
  const { balance, isLoading } = useUSDCBalance();

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-sm text-gray-400 mb-1">Votre solde USDC (Sepolia)</p>
      <p className="text-2xl font-bold text-white">
        {isLoading ? '...' : `${balance.toFixed(2)} USDC`}
      </p>
      <a
        href="https://faucet.circle.com/usdc"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
      >
        💰 Obtenir des USDC de test →
      </a>
    </div>
  );
}

interface TokenCardProps {
  token: HedgedToken;
  onClick: () => void;
}

function TokenCard({ token, onClick }: TokenCardProps) {
  const { nav, balance, isLoading } = useTokenNAV(token.id as TokenId);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 text-left transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{token.icon}</span>
          <div>
            <p className="font-semibold text-white">{token.name}</p>
            <p className="text-sm text-gray-400">{token.symbol}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          token.type === 'cross' ? 'bg-purple-500/20 text-purple-400' :
          token.type === 'mm' ? 'bg-blue-500/20 text-blue-400' :
          'bg-cyan-500/20 text-cyan-400'
        }`}>
          {token.type === 'cross' ? 'Cross' : token.type === 'mm' ? 'MM' : 'Beta'}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{token.description}</p>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">NAV par token</p>
          <p className="font-mono text-white">
            {isLoading ? '...' : `$${nav.toFixed(4)}`}
          </p>
        </div>
        {balance > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Vos tokens</p>
            <p className="font-mono text-green-400">
              {balance.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </button>
  );
}

interface MintModalProps {
  token: HedgedToken | null;
  onClose: () => void;
}

function MintModal({ token, onClose }: MintModalProps) {
  const [amount, setAmount] = useState('100');
  const { mintWithApproval, isPending, isApproving, isMinting } = useMintWithApproval(token?.id as TokenId);
  const { nav, balance: tokenBalance } = useTokenNAV(token?.id as TokenId);
  const { balance: usdcBalance } = useUSDCBalance();

  if (!token) return null;

  const amountNum = parseFloat(amount) || 0;
  const estimatedTokens = amountNum / nav;
  const hasEnoughBalance = usdcBalance >= amountNum;

  const handleMint = async () => {
    try {
      await mintWithApproval(amountNum);
      onClose();
    } catch (error) {
      console.error('Mint error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{token.icon}</span>
            <div>
              <p className="font-semibold text-white">Acheter {token.name}</p>
              <p className="text-sm text-gray-400">{token.symbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* NAV Info */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">NAV actuelle</span>
            <span className="font-mono text-white">${nav.toFixed(4)}</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Montant USDC à investir</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl text-xl font-bold text-white focus:outline-none focus:border-white/30"
              placeholder="100"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">USDC</span>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2 mt-3">
            {[50, 100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-black/30 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tokens estimés</span>
            <span className="font-mono text-white">{estimatedTokens.toFixed(4)} {token.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Vos tokens existants</span>
            <span className="font-mono text-white">{tokenBalance.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-white/10">
            <span className="text-gray-400">Votre solde USDC</span>
            <span className="font-mono text-white">{usdcBalance.toFixed(2)}</span>
          </div>
        </div>

        {/* Warning */}
        {!hasEnoughBalance && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-400">
              ⚠️ Solde USDC insuffisant. Obtenez des USDC de test sur le faucet.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleMint}
          disabled={!hasEnoughBalance || isPending || amountNum <= 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            !hasEnoughBalance || amountNum <= 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : `bg-gradient-to-r ${token.color} text-white shadow-lg hover:opacity-90`
          }`}
        >
          {isApproving ? '🔄 Approval en cours...' :
           isMinting ? '⏳ Transaction en cours...' :
           `📈 Acheter pour ${amountNum} USDC`}
        </button>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Frais de gas estimés: ~$0.01-0.05 (Sepolia)
        </p>
      </div>
    </div>
  );
}

// === Main Dashboard ===

export function HedgedTokensDashboard() {
  const [selectedToken, setSelectedToken] = useState<HedgedToken | null>(null);
  const [filter, setFilter] = useState<'all' | 'cross' | 'mm' | 'beta'>('all');
  const { tokens, tokenData, isLoading } = useAllTokensNAV();

  const filteredTokens = filter === 'all'
    ? tokens
    : HEDGED_TOKENS_BY_TYPE[filter];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Hedged Tokens</h1>
            <p className="text-sm text-gray-400">Stratégies hedged sur Sepolia Testnet</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Sepolia Testnet
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <NetworkWarning />
        <WalletWarning />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <BalanceCard />
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Tokens disponibles</p>
            <p className="text-2xl font-bold text-white">{tokens.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-1">Total TVL (testnet)</p>
            <p className="text-2xl font-bold text-white">
              ${tokenData.reduce((sum, t) => sum + (t.totalSupply * t.nav), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'all', label: 'Tous', count: tokens.length },
            { key: 'cross', label: 'Cross Asset', count: HEDGED_TOKENS_BY_TYPE.cross.length },
            { key: 'mm', label: 'Market Making', count: HEDGED_TOKENS_BY_TYPE.mm.length },
            { key: 'beta', label: 'Beta', count: HEDGED_TOKENS_BY_TYPE.beta.length },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === f.key
                  ? 'bg-white text-gray-900'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {f.label} <span className="text-opacity-50">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Tokens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onClick={() => setSelectedToken(token)}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <p className="font-medium text-white mb-1">Obtenez des USDC de test</p>
              <p className="text-sm text-gray-400">
                Allez sur le <a href="https://faucet.circle.com/usdc" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">faucet Circle</a> pour recevoir des USDC sur Sepolia.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <p className="font-medium text-white mb-1">Choisissez une stratégie</p>
              <p className="text-sm text-gray-400">
                Sélectionnez un token ci-dessus. Chaque token représente une stratégie différente avec sa propre NAV.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <p className="font-medium text-white mb-1">Achetez des tokens</p>
              <p className="text-sm text-gray-400">
                Investissez vos USDC pour recevoir des tokens. La NAV évolue selon la performance de la stratégie.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mint Modal */}
      <MintModal
        token={selectedToken}
        onClose={() => setSelectedToken(null)}
      />
    </div>
  );
}
