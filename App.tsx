import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HowItWorksScreen } from '@/components/how-it-works-screen';
import { useAppFlow } from '@/navigation/app-flow';
import { OnboardingScreen } from '@/screens/onboarding-screen';
import { TopUpWalletScreen } from '@/screens/top-up-wallet-screen';
import { WalletHomeScreen } from '@/screens/wallet-home-screen';
import './global.css';

export default function App() {
  const router = useRouter();
  const flow = useAppFlow();

  return (
    <SafeAreaProvider>
      {flow.currentScreen === 'onboarding' ? (
        <OnboardingScreen onContinue={flow.showHowItWorks} />
      ) : null}
      {flow.currentScreen === 'how-it-works' ? (
        <HowItWorksScreen onBack={flow.goBackToOnboarding} onContinue={flow.showTopUpWallet} />
      ) : null}
      {flow.currentScreen === 'top-up-wallet' ? (
        <TopUpWalletScreen onBack={flow.goBackToHowItWorks} onComplete={flow.goHome} />
      ) : null}
      {flow.currentScreen === 'home' ? (
        <WalletHomeScreen onScanQr={() => router.push('/scan-qr')} onTopUp={flow.showTopUpWallet} />
      ) : null}
    </SafeAreaProvider>
  );
}
