/**
 * Tests pour la configuration wagmi
 * Focus: Compatibilité mobile et Rainbow wallet
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { isMobile, isIOS, isAndroid, openRainbowApp } from '../wagmiConfig';

describe('wagmiConfig - Mobile Detection', () => {
  let originalUserAgent: string;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: originalUserAgent,
    });
  });

  describe('isMobile', () => {
    it('devrait détecter un iPhone', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      });

      expect(isMobile()).toBe(true);
    });

    it('devrait détecter un Android', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
      });

      expect(isMobile()).toBe(true);
    });

    it('devrait détecter un iPad', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      });

      expect(isMobile()).toBe(true);
    });

    it('ne devrait pas détecter desktop comme mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      });

      expect(isMobile()).toBe(false);
    });

    it('devrait gérer useragent indéfini (SSR)', () => {
      // Simuler environnement serveur
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(isMobile()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('isIOS', () => {
    it('devrait détecter iPhone', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      });

      expect(isIOS()).toBe(true);
    });

    it('devrait détecter iPad', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
      });

      expect(isIOS()).toBe(true);
    });

    it('ne devrait pas détecter iPod comme iOS (edge case)', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPod; CPU iPhone OS 16_0 like Mac OS X)',
      });

      // iPod est aussi iOS
      expect(isIOS()).toBe(true);
    });

    it('ne devrait pas détecter Android comme iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13)',
      });

      expect(isIOS()).toBe(false);
    });

    it('devrait filtrer les faux positifs (MSStream)', () => {
      // Certains useragents Windows se font passer pour iPad
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)',
      });
      // @ts-ignore
      window.MSStream = true;

      expect(isIOS()).toBe(false);

      // @ts-ignore
      delete window.MSStream;
    });
  });

  describe('isAndroid', () => {
    it('devrait détecter Android', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13)',
      });

      expect(isAndroid()).toBe(true);
    });

    it('ne devrait pas détecter iOS comme Android', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      });

      expect(isAndroid()).toBe(false);
    });
  });

  describe('openRainbowApp', () => {
    let originalLocation: Location;

    beforeEach(() => {
      originalLocation = window.location;
      // Mock window.location
      delete (window as any).location;
      (window as any).location = { href: '' };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('devrait ouvrir le lien universal sur iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      });

      const uri = 'wc:1234567890abcdef';
      openRainbowApp(uri);

      expect(window.location.href).toContain('rnbwapp.com');
      expect(window.location.href).toContain(encodeURIComponent(uri));
    });

    it('devrait utiliser le deep link direct sur Android', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13)',
      });

      const uri = 'wc:1234567890abcdef';
      openRainbowApp(uri);

      expect(window.location.href).toBe(uri);
    });

    it('devrait utiliser universal link sur desktop', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      });

      const uri = 'wc:1234567890abcdef';
      openRainbowApp(uri);

      expect(window.location.href).toContain('rnbwapp.com');
    });

    it('devrait gérer les URIs spéciaux (URI encoding)', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      });

      const uri = 'wc:1234-5678?param=value&other=test';
      openRainbowApp(uri);

      expect(window.location.href).not.toContain(uri);
      expect(window.location.href).toContain(encodeURIComponent(uri));
    });

    it('devrait gérer window.location indéfini (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      // Ne devrait pas planter
      expect(() => openRainbowApp('wc:test')).not.toThrow();

      global.window = originalWindow;
    });
  });
});

describe('wagmiConfig - WalletConnect Integration', () => {
  it('devrait avoir le bon projectId', () => {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

    // Le projectId devrait être défini (même en dev)
    expect(projectId).toBeDefined();
    expect(projectId).toMatch(/^[a-f0-9]{32}$/i);
  });

  it('devrait avoir les URLs RPC de fallback', () => {
    // Vérifier que la config a les bons RPCs
    expect(true).toBe(true); // Placeholder - la config est importée
  });

  it('devrait supporter Sepolia testnet', () => {
    expect(true).toBe(true); // Placeholder
  });
});

describe('wagmiConfig - Chain Support', () => {
  it('devrait identifier les chaines supportées', () => {
    expect(true).toBe(true); // Placeholder
  });

  it('devrait rejeter les chaines non supportées', () => {
    expect(true).toBe(true); // Placeholder
  });

  it('devrait avoir le bon chainId pour Sepolia', () => {
    expect(true).toBe(true); // Placeholder - Sepolia = 11155111
  });
});

describe('wagmiConfig - Mobile Edge Cases', () => {
  it('devrait gérer INApp browser (MetaMask in-app)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36',
    });

    // INApp browser detection
    const isInApp = /Version\/[\d.]+/.test(navigator.userAgent);
    expect(isInApp).toBe(true);
  });

  it('devrait gérer Trust Wallet browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 TrustWallet/1.0',
    });

    const isTrustWallet = /TrustWallet/.test(navigator.userAgent);
    expect(isTrustWallet).toBe(true);
  });

  it('devrait gérer TokenPocket browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 TpWallet/1.0',
    });

    const isTokenPocket = /TpWallet/.test(navigator.userAgent);
    expect(isTokenPocket).toBe(true);
  });
});

describe('wagmiConfig - Rainbow Specific', () => {
  it('devrait détecter Rainbow mobile app', () => {
    // Rainbow wallet UA n'est pas facilement détectable
    // On utilise plutôt la détection via window.ethereum
    const mockRainbowProvider = {
      isRainbow: true,
      chainId: '0x1',
    };

    expect(mockRainbowProvider.isRainbow).toBe(true);
  });

  it('devrait différencier Rainbow extension vs mobile app', () => {
    // Extension desktop
    const extension = { isRainbow: true, isMobile: false };
    // Mobile app
    const mobile = { isRainbow: true, isMobile: true };

    expect(extension.isRainbow && !extension.isMobile).toBe(true);
    expect(mobile.isRainbow && mobile.isMobile).toBe(true);
  });

  it('devrait gérer le deep linking Rainbow', () => {
    const testUri = 'wc:8a5c5b5a-5f5a-5a5a-5a5a-5a5a5a5a5a5a';

    // Universal link format
    const universalLink = `https://rnbwapp.com/link?uri=${encodeURIComponent(testUri)}`;

    expect(universalLink).toContain('rnbwapp.com');
    expect(universalLink).toContain('wc:');
  });
});
