import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FlowScreenTransition } from '@/components/flow-screen-transition';
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
        <FlowScreenTransition>
          <OnboardingScreen onContinue={flow.showHowItWorks} />
        </FlowScreenTransition>
      ) : null}
      {flow.currentScreen === 'how-it-works' ? (
        <FlowScreenTransition>
          <HowItWorksScreen onBack={flow.goBackToOnboarding} onContinue={flow.showTopUpWallet} />
        </FlowScreenTransition>
      ) : null}
      {flow.currentScreen === 'top-up-wallet' ? (
        <FlowScreenTransition>
          <TopUpWalletScreen onBack={flow.goBackToHowItWorks} onComplete={flow.goHome} />
        </FlowScreenTransition>
      ) : null}
      {flow.currentScreen === 'home' ? (
        <FlowScreenTransition>
          <WalletHomeScreen
            onScanQr={() => router.push('/scan-qr')}
            onTopUp={flow.showTopUpWallet}
          />
        </FlowScreenTransition>
      ) : null}
    </SafeAreaProvider>
  );
}
