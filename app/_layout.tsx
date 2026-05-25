import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { WalletProvider } from '@/context/wallet-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <Slot />
      </WalletProvider>
    </SafeAreaProvider>
  );
}
