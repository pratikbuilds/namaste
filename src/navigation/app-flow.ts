import { useCallback, useEffect, useState } from 'react';

import { preloadRemoteIcons, preloadScreenAssets } from '@/navigation/screen-assets';

export type FlowScreen = 'onboarding' | 'how-it-works' | 'top-up-wallet' | 'home';

function useScreenAssetWarmup() {
  const [assetsReady, setAssetsReady] = useState(false);

  const warmScreenAssets = useCallback(async () => {
    if (assetsReady) {
      return;
    }

    try {
      await preloadScreenAssets();
    } finally {
      setAssetsReady(true);
    }
  }, [assetsReady]);

  useEffect(() => {
    let mounted = true;

    preloadScreenAssets()
      .catch(() => undefined)
      .finally(() => {
        if (mounted) {
          setAssetsReady(true);
        }
      });

    preloadRemoteIcons();

    return () => {
      mounted = false;
    };
  }, []);

  return warmScreenAssets;
}

export function useAppFlow(initialScreen: FlowScreen = 'onboarding') {
  const warmScreenAssets = useScreenAssetWarmup();
  const [currentScreen, setCurrentScreen] = useState<FlowScreen>(initialScreen);

  async function navigateWithinFlow(screen: FlowScreen) {
    await warmScreenAssets();
    setCurrentScreen(screen);
  }

  return {
    currentScreen,
    goBackToHowItWorks: () => setCurrentScreen('how-it-works'),
    goBackToOnboarding: () => setCurrentScreen('onboarding'),
    goHome: () => setCurrentScreen('home'),
    showHowItWorks: () => {
      void navigateWithinFlow('how-it-works');
    },
    showTopUpWallet: () => {
      void navigateWithinFlow('top-up-wallet');
    },
  };
}
