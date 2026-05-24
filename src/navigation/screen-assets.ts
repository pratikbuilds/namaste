import { Asset } from 'expo-asset';
import { Image } from 'react-native';

import howItWorksBackground from '../../assets/how-it-works-bg.jpg';
import loadMoneyArtwork from '../../assets/how-it-works-load-money.jpg';
import payInstantlyArtwork from '../../assets/how-it-works-pay-instantly.jpg';
import scanFonePayArtwork from '../../assets/how-it-works-scan-fonepay.jpg';
import onboardingBackground from '../../assets/namaste-onboarding-bg.jpg';
import topUpExchangeArtwork from '../../assets/top-up-exchange-art.jpg';
import topUpBackground from '../../assets/top-up-wallet-bg.jpg';

export const googleIconUrl = 'https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png';

export const onboardingFeatures = [
  {
    title: 'Secure & trusted',
    subtitle: 'Your payments are safe',
    backgroundColor: '#e8f1ff',
    iconUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6e1.png',
  },
  {
    title: 'Instant & private',
    subtitle: 'No sign-up needed',
    backgroundColor: '#fff3d7',
    iconUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png',
  },
  {
    title: 'Made for Nepal',
    subtitle: 'Loved by locals, built for you',
    backgroundColor: '#ffe6df',
    iconUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f1f3-1f1f5.png',
  },
] as const;

export { onboardingBackground };

const remoteIconUrls = [googleIconUrl, ...onboardingFeatures.map((feature) => feature.iconUrl)];

const preloadedScreenAssets = [
  onboardingBackground,
  howItWorksBackground,
  loadMoneyArtwork,
  payInstantlyArtwork,
  scanFonePayArtwork,
  topUpBackground,
  topUpExchangeArtwork,
];

export function preloadRemoteIcons() {
  void Promise.all(remoteIconUrls.map((url) => Image.prefetch(url)));
}

export async function preloadScreenAssets() {
  await Asset.loadAsync(preloadedScreenAssets);
}
