'use client';

import React from 'react';
import { CONTRACTS } from '@/lib/config/contracts';
import { useVolatilityData, useRiskManager, useCommitReveal, useSqueethExecutor } from '@/lib/web3/hooks';

interface ContractInfo {
  name: string;
  address: string;
  description: string;
}

interface ContractPanelProps {
  contract: ContractInfo;
  status?: 'active' | 'inactive' | 'loading' | 'error';
  data?: React.ReactNode;
  error?: string;
}

export default function ContractPanel({ contract, status = 'loading', data, error }: ContractPanelProps) {
  const statusColors = {
    active: 'bg-green-500/10 border-green-500/30',
    inactive: 'bg-gray-500/10 border-gray-500/30',
    loading: 'bg-blue-500/10 border-blue-500/30',
    error: 'bg-red-500/10 border-red-500/30',
  };

  const statusBadges = {
    active: <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Active</span>,
    inactive: <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">Inactive</span>,
    loading: <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">Loading...</span>,
    error: <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">Error</span>,
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]} transition-all duration-300 hover:shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{contract.description}</p>
        </div>
        {statusBadges[status]}
      </div>

      {/* Address */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Contract Address</p>
        <a
          href={`https://sepolia.etherscan.io/address/${contract.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-mono text-primary-400 hover:text-primary-300 transition-colors"
        >
          {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
          <span className="ml-1 text-xs">↗</span>
        </a>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Data */}
      {data && (
        <div className="mt-3 pt-3 border-t border-white/10">
          {data}
        </div>
      )}
    </div>
  );
}

// === Specialized Contract Panels ===

export function VolatilityOraclePanel() {
  const { volatility, latestVolatility, isLoading, error } = useVolatilityData();

  const formatValue = (value?: bigint) => {
    if (!value) return 'N/A';
    return (Number(value) / 1e18).toFixed(4);
  };

  // Handle the tuple return from latestVolatility
  const volatilityValue = latestVolatility as readonly [bigint, bigint] | undefined;
  const value = volatilityValue?.[0];
  const timestamp = volatilityValue?.[1];

  return (
    <ContractPanel
      contract={CONTRACTS.sepolia.VolatilityOracle}
      status={error ? 'error' : isLoading ? 'loading' : 'active'}
      error={error?.message}
      data={
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Latest Volatility</span>
            <span className="text-sm font-mono text-white">{formatValue(value)}</span>
          </div>
          {timestamp && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Last Updated</span>
              <span className="text-sm font-mono text-white">
                {new Date(Number(timestamp) * 1000).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}

export function RiskManagerPanel() {
  const { maxPositionSize, riskFactor, userRiskLevel, isLoading, error } = useRiskManager();

  return (
    <ContractPanel
      contract={CONTRACTS.sepolia.RiskManager}
      status={error ? 'error' : isLoading ? 'loading' : 'active'}
      error={error?.message}
      data={
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Max Position Size</span>
            <span className="text-sm font-mono text-white">
              {maxPositionSize ? `${Number(maxPositionSize) / 1e18} ETH` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Risk Factor</span>
            <span className="text-sm font-mono text-white">
              {riskFactor ? (Number(riskFactor) / 100).toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Your Risk Level</span>
            <span className="text-sm font-mono text-white">
              {userRiskLevel !== undefined && userRiskLevel !== null ? userRiskLevel.toString() : 'N/A'}
            </span>
          </div>
        </div>
      }
    />
  );
}

export function CommitRevealPanel() {
  const { commitPeriodEnd, revealPeriodEnd, hasCommitted, userCommitment, isLoading, error } = useCommitReveal();

  const formatDate = (timestamp?: bigint | unknown) => {
    if (!timestamp || typeof timestamp !== 'bigint') return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <ContractPanel
      contract={CONTRACTS.sepolia.CommitReveal}
      status={error ? 'error' : isLoading ? 'loading' : 'active'}
      error={error?.message}
      data={
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Commit Period Ends</span>
            <span className="text-sm font-mono text-white">{formatDate(commitPeriodEnd)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Reveal Period Ends</span>
            <span className="text-sm font-mono text-white">{formatDate(revealPeriodEnd)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Your Commitment</span>
            <span className={`text-sm font-medium ${hasCommitted ? 'text-green-400' : 'text-gray-400'}`}>
              {hasCommitted ? 'Committed' : 'No commitment'}
            </span>
          </div>
        </div>
      }
    />
  );
}

export function SqueethExecutorPanel() {
  const { isActive, totalExecutions, totalProfit, isLoading, error } = useSqueethExecutor();

  return (
    <ContractPanel
      contract={CONTRACTS.sepolia.SqueethArbExecutor}
      status={error ? 'error' : isLoading ? 'loading' : isActive ? 'active' : 'inactive'}
      error={error?.message}
      data={
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Status</span>
            <span className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-red-400'}`}>
              {isActive ? 'Active' : 'Paused'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Total Executions</span>
            <span className="text-sm font-mono text-white">{totalExecutions?.toString() || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Total Profit</span>
            <span className="text-sm font-mono text-white">
              {totalProfit ? `${Number(totalProfit) / 1e18} ETH` : '0 ETH'}
            </span>
          </div>
        </div>
      }
    />
  );
}
