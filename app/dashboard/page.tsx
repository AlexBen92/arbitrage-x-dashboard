'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  WalletConnectButton,
  NetworkStatus,
  VolatilityOraclePanel,
  RiskManagerPanel,
  CommitRevealPanel,
  SqueethExecutorPanel,
  ConnectionStatusBanner,
  SystemHealthOverview,
  WalletConnectionStatus,
} from '@/components/web3';
import { siteConfig } from '@/lib/landingConfig';
import { useArbitrageExecutionWithReceipt, useCommitIntentWithReceipt } from '@/lib/web3';
import { TransactionStatusIndicator, ExecutionControls } from '@/components/web3';

export default function DashboardPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showTxModal, setShowTxModal] = useState(false);
  const { address, isConnected } = useAccount();

  // Example transaction hooks (for demo purposes)
  const arbitrageTx = useArbitrageExecutionWithReceipt();
  const commitTx = useCommitIntentWithReceipt();

  const handleExecuteDemo = () => {
    // This is a placeholder - real execution would require actual parameters
    alert('Execution functionality requires contract-specific parameters.\nThis will be implemented based on your contract requirements.');
  };

  return (
    <main className="min-h-screen bg-crypto-darker">
      {/* Connection Status Banner */}
      <ConnectionStatusBanner />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-crypto-darker/90 backdrop-blur-md border-b border-crypto-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <a href="/" className="text-xl font-bold gradient-text">
                {siteConfig.name}
              </a>
              <a
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <NetworkStatus />
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Arbitrage Dashboard</h1>
          <p className="text-gray-400">
            Monitor and interact with ArbitrageX smart contracts on Sepolia testnet
          </p>
        </div>

        {/* System Health */}
        <div className="mb-6">
          <SystemHealthOverview />
        </div>

        {/* Wallet Connection Card */}
        <div className="mb-6">
          <WalletConnectionStatus />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Network"
            value="Sepolia"
            icon="🔗"
            color="blue"
          />
          <StatCard
            title="Contracts"
            value="4"
            icon="📜"
            color="purple"
          />
          <StatCard
            title="Status"
            value="Active"
            icon="⚡"
            color="green"
          />
          <StatCard
            title="Auto-refresh"
            value={autoRefresh ? 'On' : 'Off'}
            icon={autoRefresh ? '🔄' : '⏸️'}
            color={autoRefresh ? 'green' : 'gray'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            interactive
          />
        </div>

        {/* Transaction Status (if any) */}
        {(arbitrageTx.status !== 'idle' || commitTx.status !== 'idle') && (
          <div className="mb-6 space-y-4">
            {arbitrageTx.status !== 'idle' && (
              <TransactionStatusIndicator
                status={arbitrageTx.status}
                hash={arbitrageTx.hash}
                error={arbitrageTx.error}
                onReset={arbitrageTx.reset}
              />
            )}
            {commitTx.status !== 'idle' && (
              <TransactionStatusIndicator
                status={commitTx.status}
                hash={commitTx.hash}
                error={commitTx.error}
                onReset={commitTx.reset}
              />
            )}
          </div>
        )}

        {/* Contract Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolatilityOraclePanel />
          <RiskManagerPanel />
          <CommitRevealPanel />
          <SqueethExecutorPanel />
        </div>

        {/* Execution Controls (Demo) */}
        {isConnected && (
          <div className="mt-8 p-6 bg-crypto-card/50 border border-crypto-border rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Execution Controls</h2>
            <p className="text-sm text-gray-400 mb-4">
              This section will contain contract-specific execution controls once parameters are defined.
            </p>
            <ExecutionControls
              contractName="Arbitrage"
              onExecute={handleExecuteDemo}
            >
              <p className="text-xs text-gray-500 mt-4 text-center">
                Execution parameters will be configured based on your strategy requirements.
              </p>
            </ExecutionControls>
          </div>
        )}

        {/* Deployment Info */}
        <div className="mt-8 p-6 bg-crypto-card/50 border border-crypto-border rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Sepolia Deployment Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeploymentAddress
              name="Volatility Oracle"
              address="0xD9e3c3dFe9872454F35Bd567c1A267C35FE0BbAd"
            />
            <DeploymentAddress
              name="Risk Manager"
              address="0x82646884d0e549041c19666B091aAf9625cE976b"
            />
            <DeploymentAddress
              name="Commit Reveal"
              address="0x66afC814867801A3D33057545b97Cd61F2ACc4E9"
            />
            <DeploymentAddress
              name="Squeeth Arb Executor"
              address="0xa7da116b72a7db4875D52a424da2963082647987"
            />
          </div>
        </div>

        {/* RPC Diagnostics */}
        <div className="mt-6 p-6 bg-crypto-card/50 border border-crypto-border rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Network Diagnostics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-crypto-darker rounded-lg">
              <p className="text-gray-500 mb-1">Connected Wallet</p>
              <p className="font-mono text-white">
                {address || 'Not connected'}
              </p>
            </div>
            <div className="p-3 bg-crypto-darker rounded-lg">
              <p className="text-gray-500 mb-1">Network</p>
              <p className="text-white">Sepolia Testnet</p>
            </div>
            <div className="p-3 bg-crypto-darker rounded-lg">
              <p className="text-gray-500 mb-1">Chain ID</p>
              <p className="text-white">11155111</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">📋 Getting Started</h3>
          <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Connect your wallet using the button in the top right</li>
            <li>Make sure you&apos;re on Sepolia testnet (the app will prompt you if not)</li>
            <li>Get Sepolia ETH from a faucet like <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">sepoliafaucet.com</a></li>
            <li>View real-time contract data in the panels above</li>
            <li>Execution controls will be enabled once parameters are configured</li>
          </ol>
        </div>

        {/* Error Logs (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-6 bg-gray-900/50 border border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-400 mb-3">🔍 Debug Info</h3>
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-400">View Recent Errors</summary>
              <pre className="mt-2 p-2 bg-black rounded text-gray-400 overflow-auto max-h-40">
                {/* Error logs would appear here */}
                No errors logged yet.
              </pre>
            </details>
          </div>
        )}
      </div>
    </main>
  );
}

// === Sub-components ===

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green' | 'gray';
  onClick?: () => void;
  interactive?: boolean;
}

function StatCard({ title, value, icon, color, onClick, interactive }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20',
    green: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20',
    gray: 'bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border ${colorClasses[color]} transition-all duration-300 ${interactive ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface DeploymentAddressProps {
  name: string;
  address: string;
}

function DeploymentAddress({ name, address }: DeploymentAddressProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{name}</p>
      <a
        href={`https://sepolia.etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-mono text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
      >
        <span className="truncate">{address}</span>
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
