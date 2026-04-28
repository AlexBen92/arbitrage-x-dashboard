'use client';

import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';

export default function WalletConnectButton() {
  return (
    <ConnectKitButton />
  );
}
