import { useRouter } from 'expo-router';

import { TopUpWalletScreen } from '@/screens/top-up-wallet-screen';

export default function TopUpWalletRoute() {
  const router = useRouter();

  return (
    <TopUpWalletScreen onBack={() => router.back()} onComplete={() => router.push('/wallet')} />
  );
}
