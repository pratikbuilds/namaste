import { useRouter } from 'expo-router';

import { useWallet } from '@/context/wallet-context';
import { TopUpWalletScreen } from '@/screens/top-up-wallet-screen';

export default function TopUpWalletRoute() {
  const router = useRouter();
  const { addBalance } = useWallet();

  return (
    <TopUpWalletScreen
      onBack={() => router.back()}
      onComplete={() => router.back()}
      onConfirm={addBalance}
    />
  );
}
