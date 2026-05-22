import { ScreenContent } from '@/components/screen-content';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <ScreenContent title="Namaste" path="App.tsx" />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
