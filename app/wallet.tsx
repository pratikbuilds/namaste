import { useRouter } from 'expo-router';

import { WalletHomeScreen } from '@/screens/wallet-home-screen';

export default function WalletRoute() {
  const router = useRouter();

  return (
    <WalletHomeScreen
      onScanQr={() => router.push('/scan-qr')}
      onTopUp={() => router.push('/top-up-wallet')}
    />
  );
}
