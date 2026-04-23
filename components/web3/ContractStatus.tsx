/**
 * Enhanced Contract Status Component
 * Shows contract status with health indicators and diagnostics
 */

'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { useRpcDiagnostics, getConnectionQuality, getQualityColor } from '@/lib/web3/diagnostics';
import { useAccount } from 'wagmi';

export interface ContractStatusProps {
  name: string;
  address: string;
  isActive?: boolean;
  lastUpdate?: Date;
  error?: string;
}

/**
 * Individual Contract Status Badge
 */
export function ContractStatusBadge({ isActive, error }: { isActive?: boolean; error?: string }) {
  if (error) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
        <XCircle className="w-3 h-3" />
        Error
      </span>
    );
  }

  if (isActive === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">
        <Clock className="w-3 h-3" />
        Loading
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
        <CheckCircle2 className="w-3 h-3" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full">
      <AlertCircle className="w-3 h-3" />
      Inactive
    </span>
  );
}

/**
 * Contract Status Card with Diagnostics
 */
export function ContractStatusCard({ name, address, isActive, lastUpdate, error }: ContractStatusProps) {
  const { diagnostics } = useRpcDiagnostics();
  const connectionQuality = getConnectionQuality(diagnostics.rpcHealth.latency);

  return (
    <div className="p-4 bg-crypto-card/50 border border-crypto-border rounded-xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{name}</h3>
          <a
            href={`https://sepolia.etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-400 hover:text-primary-300 font-mono"
          >
            {address.slice(0, 10)}...{address.slice(-8)}
          </a>
        </div>
        <ContractStatusBadge isActive={isActive} error={error} />
      </div>

      {/* Health Indicators */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <Activity className="w-3 h-3" />
          <span>RPC: </span>
          <span className={getQualityColor(connectionQuality)}>
            {connectionQuality}
          </span>
        </div>
        {diagnostics.rpcHealth.latency && (
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{Math.round(diagnostics.rpcHealth.latency)}ms</span>
          </div>
        )}
        {lastUpdate && (
          <div className="col-span-2 text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

/**
 * System Health Overview
 */
export function SystemHealthOverview() {
  const { diagnostics } = useRpcDiagnostics();

  const healthItems = [
    {
      label: 'Network',
      value: diagnostics.isSupportedNetwork ? 'Sepolia' : 'Wrong Network',
      status: diagnostics.isSupportedNetwork ? 'healthy' : 'error',
    },
    {
      label: 'RPC Connection',
      value: diagnostics.rpcHealth.isHealthy ? 'Connected' : 'Disconnected',
      status: diagnostics.rpcHealth.isHealthy ? 'healthy' : 'error',
    },
    {
      label: 'Latency',
      value: diagnostics.rpcHealth.latency
        ? `${Math.round(diagnostics.rpcHealth.latency)}ms`
        : 'Unknown',
      status: diagnostics.rpcHealth.latency && diagnostics.rpcHealth.latency < 1000
        ? 'healthy'
        : 'warning',
    },
    {
      label: 'Block',
      value: diagnostics.blockNumber?.toString() || 'N/A',
      status: 'info' as const,
    },
  ];

  const statusColors: Record<string, string> = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    info: 'text-gray-400',
  };

  return (
    <div className="p-4 bg-crypto-card/50 border border-crypto-border rounded-xl">
      <h3 className="font-semibold text-white mb-3">System Health</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {healthItems.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={`text-sm font-medium ${statusColors[item.status]}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Wallet Connection Status
 */
export function WalletConnectionStatus() {
  const { address, isConnected } = useAccount();
  const { diagnostics } = useRpcDiagnostics();

  if (!isConnected) {
    return (
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-400" />
        <span className="text-sm text-yellow-400">Wallet not connected</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm text-green-400">Connected</span>
      </div>
      {address && (
        <span className="text-xs text-gray-400 font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
    </div>
  );
}
