import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HowItWorksScreen } from '@/components/how-it-works-screen';
import { TopUpWalletScreen } from '@/screens/top-up-wallet-screen';
import { WalletHomeScreen } from '@/screens/wallet-home-screen';
import { appFontFamily } from '@/theme/typography';
import howItWorksBackground from './assets/how-it-works-bg.jpg';
import loadMoneyArtwork from './assets/how-it-works-load-money.jpg';
import payInstantlyArtwork from './assets/how-it-works-pay-instantly.jpg';
import scanFonePayArtwork from './assets/how-it-works-scan-fonepay.jpg';
import onboardingBackground from './assets/namaste-onboarding-bg.jpg';
import topUpExchangeArtwork from './assets/top-up-exchange-art.jpg';
import topUpBackground from './assets/top-up-wallet-bg.jpg';
import './global.css';

const features = [
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

const googleIconUrl = 'https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png';
const remoteIconUrls = [googleIconUrl, ...features.map((feature) => feature.iconUrl)];
const preloadedScreenAssets = [
  onboardingBackground,
  howItWorksBackground,
  loadMoneyArtwork,
  payInstantlyArtwork,
  scanFonePayArtwork,
  topUpBackground,
  topUpExchangeArtwork,
];

function FeatureIcon({ iconUrl }: { iconUrl: string }) {
  return <Image source={{ uri: iconUrl }} resizeMode="contain" style={styles.featureIconImage} />;
}

function GoogleMark() {
  return (
    <View style={styles.googleMark}>
      <Image source={{ uri: googleIconUrl }} resizeMode="contain" style={styles.googleIconImage} />
    </View>
  );
}

export function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(28, width * 0.07);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ImageBackground
        fadeDuration={0}
        source={onboardingBackground}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <View style={styles.bottomShadeDeep} />

        <View
          style={[
            styles.content,
            { paddingTop: Math.max(insets.top + 22, 82), paddingHorizontal: horizontalPadding },
          ]}>
          <View style={styles.heroCopy}>
            <Text selectable style={[styles.title, { fontSize: Math.min(57, width * 0.136) }]}>
              Namaste
            </Text>
            <View style={styles.redDash} />
            <Text selectable style={[styles.subtitle, { fontSize: Math.min(20, width * 0.052) }]}>
              Pay any QR in Nepal{'\n'}instantly
            </Text>
          </View>

          <View style={[styles.bottomControls, { bottom: Math.max(insets.bottom - 14, 8) }]}>
            <View style={styles.featureCard}>
              {features.map((feature, index) => (
                <View key={feature.title}>
                  <View style={styles.featureRow}>
                    <View style={[styles.iconTile, { backgroundColor: feature.backgroundColor }]}>
                      <FeatureIcon iconUrl={feature.iconUrl} />
                    </View>
                    <View style={styles.featureText}>
                      <Text selectable style={styles.featureTitle}>
                        {feature.title}
                      </Text>
                      <Text selectable style={styles.featureSubtitle}>
                        {feature.subtitle}
                      </Text>
                    </View>
                  </View>
                  {index < features.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              ))}
            </View>

            <Pressable accessibilityRole="button" onPress={onContinue} style={styles.googleButton}>
              <GoogleMark />
              <Text selectable style={styles.googleText}>
                Continue with Google
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'onboarding' | 'how-it-works' | 'top-up-wallet' | 'home'
  >('onboarding');
  const [screenAssetsReady, setScreenAssetsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    Asset.loadAsync(preloadedScreenAssets)
      .then(() => {
        if (mounted) {
          setScreenAssetsReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setScreenAssetsReady(true);
        }
      });

    void Promise.all(remoteIconUrls.map((url) => Image.prefetch(url)));

    return () => {
      mounted = false;
    };
  }, []);

  async function warmScreenAssets() {
    if (!screenAssetsReady) {
      try {
        await Asset.loadAsync(preloadedScreenAssets);
      } finally {
        setScreenAssetsReady(true);
      }
    }
  }

  async function showHowItWorks() {
    await warmScreenAssets();
    setCurrentScreen('how-it-works');
  }

  async function showTopUpWallet() {
    await warmScreenAssets();
    setCurrentScreen('top-up-wallet');
  }

  return (
    <SafeAreaProvider>
      {currentScreen === 'onboarding' ? (
        <OnboardingScreen
          onContinue={() => {
            void showHowItWorks();
          }}
        />
      ) : null}
      {currentScreen === 'how-it-works' ? (
        <HowItWorksScreen
          onBack={() => setCurrentScreen('onboarding')}
          onContinue={() => {
            void showTopUpWallet();
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
          onScanQr={() => undefined}
          onTopUp={() => {
            void showTopUpWallet();
          }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#09294b',
    overflow: 'hidden',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bottomShadeDeep: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '31%',
    backgroundColor: 'rgba(0, 43, 77, 0.44)',
  },
  content: {
    flex: 1,
  },
  bottomControls: {
    position: 'absolute',
    left: 28,
    right: 28,
  },
  heroCopy: {
    alignItems: 'flex-start',
  },
  title: {
    color: '#071f44',
    fontFamily: appFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 66,
  },
  redDash: {
    width: 52,
    height: 4,
    marginTop: 14,
    marginLeft: 2,
    borderRadius: 8,
    backgroundColor: '#f44322',
  },
  subtitle: {
    marginTop: 18,
    color: '#061d42',
    fontFamily: appFontFamily,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 27,
  },
  featureCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 250, 243, 0.98)',
    overflow: 'hidden',
  },
  featureRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    color: '#071f44',
    fontSize: 16,
    fontFamily: appFontFamily,
    fontWeight: '600',
    letterSpacing: 0,
  },
  featureSubtitle: {
    color: '#315b89',
    fontSize: 12,
    fontFamily: appFontFamily,
    fontWeight: '500',
    letterSpacing: 0,
  },
  divider: {
    height: 1,
    marginLeft: 2,
    backgroundColor: 'rgba(8, 31, 68, 0.11)',
  },
  featureIconImage: {
    width: 27,
    height: 27,
  },
  googleButton: {
    minHeight: 56,
    marginTop: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.82)',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  googleMark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconImage: {
    width: 34,
    height: 34,
  },
  googleText: {
    color: '#071f44',
    fontSize: 17,
    fontFamily: appFontFamily,
    fontWeight: '600',
    letterSpacing: 0,
  },
});
