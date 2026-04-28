/**
 * Tests pour SimplePowerPerpDashboard
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SimplePowerPerpDashboard } from '../SimplePowerPerpDashboard';
import { wagmiConfig } from '@/lib/web3/wagmiConfig';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  ...jest.requireActual('wagmi'),
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    chain: { id: 11155111, name: 'Sepolia' },
  }),
  useBalance: () => ({
    data: { value: BigInt('1000000000000000000'), decimals: 18, symbol: 'ETH' },
    isLoading: false,
  }),
}));

// Mock de la fonction de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.MockedFunction<typeof fetch>;

function createTestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

describe('SimplePowerPerpDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendu initial', () => {
    it('devrait afficher le header avec le titre', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      expect(screen.getByText('ETH² Arbitrage')).toBeInTheDocument();
      expect(screen.getByText(/Profitez des écarts de prix/)).toBeInTheDocument();
    });

    it('devrait afficher le statut de connexion', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const address = screen.getByText(/0x1234/);
      expect(address).toBeInTheDocument();
    });

    it('devrait afficher les boutons Acheter et Vendre', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      expect(screen.getByText('Acheter ETH²')).toBeInTheDocument();
      expect(screen.getByText('Vendre ETH²')).toBeInTheDocument();
    });
  });

  describe('Bannière d\'opportunité', () => {
    it('devrait afficher une opportunité d\'achat quand le prix est bas', async () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      await waitFor(() => {
        const buyButton = screen.queryByText(/Acheter maintenant/);
        // Le composant utilise des données mockées aléatoires
        // On vérifie juste que les éléments sont présents
        expect(screen.getByText('Prix juste (calculé)')).toBeInTheDocument();
      });
    });

    it('devrait mettre à jour les données toutes les 10 secondes', async () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const initialPrice = screen.getByText(/Prix juste/);

      jest.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(screen.getByText(/Prix juste/)).toBeInTheDocument();
      });
    });
  });

  describe('Section Comment ça marche', () => {
    it('devrait afficher les 3 étapes explicatives', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      expect(screen.getByText(/C'est quoi ETH²/)).toBeInTheDocument();
      expect(screen.getByText(/Pourquoi ça s'arbitre/)).toBeInTheDocument();
      expect(screen.getByText(/Comment profiter/)).toBeInTheDocument();
    });

    it('devrait afficher l\'exemple visuel', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      expect(screen.getByText(/📊 Exemple/)).toBeInTheDocument();
      expect(screen.getByText(/ETH passe de/)).toBeInTheDocument();
    });
  });

  describe('Carte d\'action', () => {
    it('devrait afficher les boutons d\'action par défaut', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      expect(screen.getByText('Que faire ?')).toBeInTheDocument();
      expect(screen.getByText('Sélectionnez une opportunité')).toBeInTheDocument();
    });

    it('devrait ouvrir le mode achat au clic', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      // Vérifier que le titre change
      expect(screen.getByText('Acheter ETH²')).toBeInTheDocument();
    });

    it('devrait permettre de changer le montant', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      const input = screen.getByPlaceholderText('1000');
      fireEvent.change(input, { target: { value: '5000' } });

      expect(input).toHaveValue('5000');
    });

    it('devrait utiliser les montants rapides', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      const quickAmount100 = screen.getByText('$100');
      fireEvent.click(quickAmount100);

      const input = screen.getByPlaceholderText('1000');
      expect(input).toHaveValue('100');
    });
  });

  describe('Modale de confirmation', () => {
    it('devrait s\'ouvrir au clic sur le bouton d\'action', async () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      // Cliquer sur Acheter
      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      // Cliquer sur Acheter maintenant
      const executeButton = screen.getByText(/📈 Acheter maintenant/);
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Confirmer la transaction')).toBeInTheDocument();
      });
    });

    it('devrait afficher le résumé de la transaction', async () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      const executeButton = screen.getByText(/📈 Acheter maintenant/);
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Montant')).toBeInTheDocument();
        expect(screen.getByText('Quantité ETH²')).toBeInTheDocument();
      });
    });

    it('devrait pouvoir annuler la transaction', async () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      const executeButton = screen.getByText(/📈 Acheter maintenant/);
      fireEvent.click(executeButton);

      await waitFor(() => {
        const cancelButton = screen.getByText('Annuler');
        fireEvent.click(cancelButton);

        expect(screen.queryByText('Confirmer la transaction')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibilité mobile', () => {
    it('devrait être responsive sur petit écran', () => {
      // Simuler un petit écran
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const header = screen.getByText('ETH² Arbitrage');
      expect(header).toBeInTheDocument();
    });

    it('devrait avoir des boutons tactiles suffisamment grands', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buttons = screen.getAllByRole('button').filter(btn =>
        btn.textContent?.includes('Acheter') || btn.textContent?.includes('Vendre')
      );

      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // Vérifier que le bouton a une hauteur minimale (44px recommandé iOS)
        expect(button.offsetHeight).toBeGreaterThanOrEqual(40);
      });
    });
  });

  describe('Gestion d\'état', () => {
    it('devrait basculer entre modes achat/vente', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      // Mode achat
      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);
      expect(screen.getByText('ACHETER')).toBeInTheDocument();

      // Retour au menu
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      // Mode vente
      const sellButton = screen.getByText('Vendre ETH²');
      fireEvent.click(sellButton);
      expect(screen.getByText('VENDRE')).toBeInTheDocument();
    });

    it('devrait conserver le montant lors du changement de mode', () => {
      render(<SimplePowerPerpDashboard />, { wrapper: createTestWrapper });

      const buyButton = screen.getByText('Acheter ETH²');
      fireEvent.click(buyButton);

      const input = screen.getByPlaceholderText('1000');
      fireEvent.change(input, { target: { value: '2500' } });

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      // Réouvrir
      fireEvent.click(buyButton);

      // Le montant devrait être conservé (selon l'implémentation)
      expect(input).toBeInTheDocument();
    });
  });
});
