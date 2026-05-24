import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HowItWorksScreen } from '@/components/how-it-works-screen';
import { preloadRemoteIcons, preloadScreenAssets } from '@/navigation/screen-assets';
import { OnboardingScreen } from '@/screens/onboarding-screen';
import { TopUpWalletScreen } from '@/screens/top-up-wallet-screen';
import { WalletHomeScreen } from '@/screens/wallet-home-screen';
import './global.css';

type FlowScreen = 'onboarding' | 'how-it-works' | 'top-up-wallet' | 'home';

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

export default function App() {
  const router = useRouter();
  const warmScreenAssets = useScreenAssetWarmup();
  const [currentScreen, setCurrentScreen] = useState<FlowScreen>('onboarding');

  async function navigateWithinFlow(screen: FlowScreen) {
    await warmScreenAssets();
    setCurrentScreen(screen);
  }

  return (
    <SafeAreaProvider>
      {currentScreen === 'onboarding' ? (
        <OnboardingScreen
          onContinue={() => {
            void navigateWithinFlow('how-it-works');
          }}
        />
      ) : null}
      {currentScreen === 'how-it-works' ? (
        <HowItWorksScreen
          onBack={() => setCurrentScreen('onboarding')}
          onContinue={() => {
            void navigateWithinFlow('top-up-wallet');
          }}
        />
      ) : null}
      {currentScreen === 'top-up-wallet' ? (
        <TopUpWalletScreen
          onBack={() => setCurrentScreen('how-it-works')}
          onComplete={() => setCurrentScreen('home')}
        />
      ) : null}
      {currentScreen === 'home' ? (
        <WalletHomeScreen
          onScanQr={() => router.push('/scan-qr')}
          onTopUp={() => {
            void navigateWithinFlow('top-up-wallet');
          }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}
