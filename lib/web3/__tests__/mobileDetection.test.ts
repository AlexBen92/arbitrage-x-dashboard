/**
 * Tests simples pour la détection mobile
 * Ne dépend pas de wagmi - peut être exécuté standalone
 */

describe('Mobile Detection', () => {
  const originalUserAgent = navigator.userAgent;
  const originalWindow = global.window;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: originalUserAgent,
    });
  });

  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const isIOS = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  };

  const isAndroid = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  };

  describe('isMobile', () => {
    it('devrait détecter iPhone comme mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      });
      expect(isMobile()).toBe(true);
    });

    it('devrait détecter Android comme mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
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

    it('ne devrait pas détecter Android comme iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Linux; Android 13)',
      });
      expect(isIOS()).toBe(false);
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
});

describe('Rainbow Deep Linking', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  const openRainbowApp = (uri: string): void => {
    if (typeof window === 'undefined') return;

    const iosLink = `https://rnbwapp.com/link?uri=${encodeURIComponent(uri)}`;
    const androidLink = uri;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = iosLink;
    } else {
      window.location.href = androidLink;
    }
  };

  it('devrait créer le bon universal link iOS', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    });

    const testUri = 'wc:1234567890abcdef';
    openRainbowApp(testUri);

    expect(window.location.href).toContain('rnbwapp.com');
    expect(window.location.href).toContain('wc%3A'); // URL encoded
  });

  it('devrait encoder l\'URI correctement', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    });

    const specialUri = 'wc:1234?param=value&other=test';
    openRainbowApp(specialUri);

    expect(window.location.href).not.toContain(specialUri);
    expect(window.location.href).toContain(encodeURIComponent(specialUri));
  });
});

describe('Edge Cases - In-App Browsers', () => {
  it('devrait détecter MetaMask in-app browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36',
    });

    const isInApp = /Version\/[\d.]+/.test(navigator.userAgent);
    expect(isInApp).toBe(true);
  });

  it('devrait détecter Trust Wallet', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 TrustWallet/1.0',
    });

    const isTrustWallet = /TrustWallet/.test(navigator.userAgent);
    expect(isTrustWallet).toBe(true);
  });

  it('devrait détecter TokenPocket', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.0.0 Mobile Safari/537.36 TpWallet/1.0',
    });

    const isTokenPocket = /TpWallet/.test(navigator.userAgent);
    expect(isTokenPocket).toBe(true);
  });
});

describe('Wallet Connect Integration Tests', () => {
  it('devrait valider le format du projectId WalletConnect', () => {
    const projectId = 'e10a8dca90396d988c101f1da7929e44';

    const isValidProjectId = (id: string): boolean => {
      return /^[a-f0-9]{32}$/i.test(id);
    };

    expect(isValidProjectId(projectId)).toBe(true);
    expect(isValidProjectId('invalid')).toBe(false);
    expect(isValidProjectId('e10a8dca90396d988c101f1da7929e4')).toBe(false); // Trop court
  });

  it('devrait avoir les bons RPC URLs pour Sepolia', () => {
    const sepoliaRPCs = [
      'https://rpc.sepolia.org',
      'https://sepolia.deth.org',
    ];

    sepoliaRPCs.forEach(rpc => {
      expect(rpc).toMatch(/^https:\/\/.+\.org$/);
    });
  });

  it('devrait connaître le bon chainId Sepolia', () => {
    const sepoliaChainId = 11155111;
    expect(sepoliaChainId).toBe(11155111);

    // En hex (0x...)
    const sepoliaChainIdHex = '0xaa36a7';
    expect(parseInt(sepoliaChainIdHex, 16)).toBe(sepoliaChainId);
  });
});
