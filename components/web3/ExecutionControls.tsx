/**
 * Execution Controls Component
 * Provides UI for executing contract actions with proper guardrails
 */

'use client';

import React, { useState } from 'react';
import { Play, Pause, AlertTriangle, Lock, Wallet, Network } from 'lucide-react';
import { useNetworkStatus } from '@/lib/web3/diagnostics';
import { useAccount } from 'wagmi';
import { logger } from '@/lib/web3/logger';

interface GuardRail {
  type: 'wallet_not_connected' | 'wrong_network' | 'contract_paused' | 'insufficient_balance' | 'permission_required';
  message: string;
  action: string;
  icon: React.ElementType;
  severity: 'warning' | 'error' | 'info';
}

interface ExecutionControlsProps {
  isPaused?: boolean;
  isAdmin?: boolean;
  onExecute?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  contractName?: string;
  children?: React.ReactNode;
}

/**
 * Check all guardrails before allowing execution
 */
export function useExecutionGuardRails(): {
  guardRails: GuardRail[];
  canExecute: boolean;
  primaryGuardRail: GuardRail | null;
} {
  const { isConnected, address, isSupportedNetwork, networkStatus } = useNetworkStatus();
  const guardRails: GuardRail[] = [];

  // Wallet not connected
  if (!isConnected) {
    guardRails.push({
      type: 'wallet_not_connected',
      message: 'Wallet not connected',
      action: 'Connect your wallet to execute transactions',
      icon: Wallet,
      severity: 'warning',
    });
  }

  // Wrong network
  if (isConnected && !isSupportedNetwork) {
    guardRails.push({
      type: 'wrong_network',
      message: networkStatus.message || 'Wrong network detected',
      action: networkStatus.action || 'Switch to Sepolia testnet',
      icon: Network,
      severity: 'error',
    });
  }

  return {
    guardRails,
    canExecute: guardRails.length === 0,
    primaryGuardRail: guardRails[0] || null,
  };
}

/**
 * GuardRail indicator component
 */
function GuardRailIndicator({ guardRail }: { guardRail: GuardRail }) {
  const Icon = guardRail.icon;

  const severityColors = {
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`p-4 rounded-xl border ${severityColors[guardRail.severity]} flex items-start gap-3`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">{guardRail.message}</p>
        <p className="text-sm mt-1 opacity-80">{guardRail.action}</p>
      </div>
    </div>
  );
}

/**
 * Main Execution Controls Component
 */
export function ExecutionControls({
  isPaused = false,
  isAdmin = false,
  onExecute,
  onPause,
  onResume,
  contractName = 'Contract',
  children,
}: ExecutionControlsProps) {
  const { guardRails, canExecute, primaryGuardRail } = useExecutionGuardRails();
  const [showGuardRails, setShowGuardRails] = useState(false);
  const { address } = useAccount();

  const handleExecute = () => {
    if (!canExecute) {
      setShowGuardRails(true);
      logger.warn('Execution blocked by guardrails', 'ExecutionControls', {
        guardRails: guardRails.map(g => g.type),
      });
      return;
    }

    if (isPaused) {
      logger.warn('Execution blocked: contract paused', 'ExecutionControls', {
        contract: contractName,
      });
      return;
    }

    logger.logContractCall(contractName, 'execute', [address]);
    onExecute?.();
  };

  return (
    <div className="space-y-4">
      {/* Guard Rails Display */}
      {showGuardRails && guardRails.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">Action Required:</p>
          {guardRails.map((guardRail) => (
            <GuardRailIndicator key={guardRail.type} guardRail={guardRail} />
          ))}
        </div>
      )}

      {/* Contract Paused Warning */}
      {isPaused && canExecute && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center gap-3">
          <Pause className="w-5 h-5 text-orange-400" />
          <div>
            <p className="font-medium text-orange-400">Contract Paused</p>
            <p className="text-sm text-gray-400">Executions are temporarily disabled</p>
          </div>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && onPause && onResume && (
        <div className="flex gap-2">
          {isPaused ? (
            <button
              onClick={onResume}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Resume Contract
            </button>
          ) : (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Pause Contract
            </button>
          )}
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={!canExecute || isPaused}
        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
          !canExecute || isPaused
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:from-primary-500 hover:to-accent-400 shadow-lg shadow-primary-500/25'
        }`}
      >
        {isPaused ? (
          <>
            <Lock className="w-5 h-5" />
            Contract Paused
          </>
        ) : !canExecute ? (
          <>
            <AlertTriangle className="w-5 h-5" />
            {primaryGuardRail?.message || 'Cannot Execute'}
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Execute {contractName}
          </>
        )}
      </button>

      {/* Additional Controls */}
      {children}
    </div>
  );
}

/**
 * Quick Action Button Component
 */
interface QuickActionProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ElementType;
}

export function QuickAction({ label, onClick, disabled, variant = 'secondary', icon: Icon }: QuickActionProps) {
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white',
    secondary: 'bg-crypto-card hover:bg-crypto-card/80 text-white border border-crypto-border',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

/**
 * Permission Badge Component
 */
export function PermissionBadge({ hasPermission, label }: { hasPermission: boolean; label: string }) {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      hasPermission
        ? 'bg-green-500/20 text-green-400'
        : 'bg-red-500/20 text-red-400'
    }`}>
      {label}
    </span>
  );
}

/**
 * Connection Status Banner
 */
export function ConnectionStatusBanner() {
  const { guardRails, canExecute, primaryGuardRail } = useExecutionGuardRails();

  if (canExecute) {
    return null;
  }

  return primaryGuardRail ? (
    <div className="fixed top-20 left-0 right-0 z-40 px-4">
      <div className="max-w-7xl mx-auto">
        <GuardRailIndicator guardRail={primaryGuardRail} />
      </div>
    </div>
  ) : null;
}
