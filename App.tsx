import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import onboardingBackground from './assets/namaste-onboarding-bg.png';
import './global.css';

const features = [
  {
    icon: 'shield',
    title: 'Secure & trusted',
    subtitle: 'Your payments are safe',
    backgroundColor: '#e8f1ff',
  },
  {
    icon: 'bolt',
    title: 'Instant & private',
    subtitle: 'No sign-up needed',
    backgroundColor: '#fff3d7',
  },
  {
    icon: 'flag',
    title: 'Made for Nepal',
    subtitle: 'Loved by locals, built for you',
    backgroundColor: '#ffe6df',
  },
] as const;

function FeatureIcon({ icon }: { icon: (typeof features)[number]['icon'] }) {
  if (icon === 'bolt') {
    return (
      <View style={styles.boltIcon}>
        <View style={styles.boltTop} />
        <View style={styles.boltBottom} />
      </View>
    );
  }

  if (icon === 'flag') {
    return (
      <View style={styles.flagIcon}>
        <View style={styles.flagPole} />
        <View style={styles.flagTriangleTop} />
        <View style={styles.flagTriangleBottom} />
        <View style={styles.flagInnerTop} />
        <View style={styles.flagInnerBottom} />
        <View style={styles.flagEmblemTop} />
        <View style={styles.flagEmblemBottom} />
      </View>
    );
  }

  return (
    <View style={styles.shieldIcon}>
      <View style={styles.shieldPoint} />
      <View style={styles.checkStem} />
      <View style={styles.checkArm} />
    </View>
  );
}

function GoogleMark() {
  return (
    <View style={styles.googleMark}>
      <Text style={[styles.googleLetter, { color: '#4285f4' }]}>G</Text>
      <View style={[styles.googlePatch, styles.googleRed]} />
      <View style={[styles.googlePatch, styles.googleYellow]} />
      <View style={[styles.googlePatch, styles.googleGreen]} />
    </View>
  );
}

function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(28, width * 0.07);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ImageBackground
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
                      <FeatureIcon icon={feature.icon} />
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

            <Pressable style={styles.googleButton}>
              <GoogleMark />
              <Text selectable style={styles.googleText}>
                Continue with Google
              </Text>
            </Pressable>

            <View style={styles.safeHands}>
              <View style={styles.safeShield}>
                <Text style={styles.safeCheck}>✓</Text>
              </View>
              <Text selectable style={styles.safeText}>
                {"You're in safe hands"}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <OnboardingScreen />
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
    fontFamily: 'AvenirNext-Heavy',
    fontWeight: '800',
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
    fontFamily: 'AvenirNext-Medium',
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
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '700',
    letterSpacing: 0,
  },
  featureSubtitle: {
    color: '#315b89',
    fontSize: 12,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    letterSpacing: 0,
  },
  divider: {
    height: 1,
    marginLeft: 2,
    backgroundColor: 'rgba(8, 31, 68, 0.11)',
  },
  shieldIcon: {
    width: 27,
    height: 31,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#2e80ee',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shieldPoint: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 20,
    backgroundColor: '#2e80ee',
    transform: [{ rotate: '45deg' }],
  },
  checkStem: {
    position: 'absolute',
    left: 8,
    top: 15,
    width: 9,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '42deg' }],
  },
  checkArm: {
    position: 'absolute',
    left: 13,
    top: 12,
    width: 15,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '-48deg' }],
  },
  boltIcon: {
    width: 24,
    height: 32,
  },
  boltTop: {
    position: 'absolute',
    left: 9,
    top: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderBottomColor: '#ffb129',
    transform: [{ skewX: '-14deg' }],
  },
  boltBottom: {
    position: 'absolute',
    left: 2,
    top: 14,
    width: 0,
    height: 0,
    borderRightWidth: 14,
    borderTopWidth: 22,
    borderRightColor: 'transparent',
    borderTopColor: '#ffb129',
    transform: [{ skewX: '-14deg' }],
  },
  flagIcon: {
    width: 27,
    height: 34,
  },
  flagPole: {
    position: 'absolute',
    left: 0,
    top: 1,
    bottom: 0,
    width: 2.5,
    borderRadius: 2,
    backgroundColor: '#0a2b67',
  },
  flagTriangleTop: {
    position: 'absolute',
    left: 3,
    top: 2,
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 23,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#102b67',
  },
  flagTriangleBottom: {
    position: 'absolute',
    left: 3,
    bottom: 3,
    width: 0,
    height: 0,
    borderTopWidth: 13,
    borderBottomWidth: 13,
    borderLeftWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#102b67',
  },
  flagInnerTop: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 0,
    height: 0,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#e23b32',
  },
  flagInnerBottom: {
    position: 'absolute',
    left: 5,
    bottom: 6,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 17,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#e23b32',
  },
  flagEmblemTop: {
    position: 'absolute',
    left: 10,
    top: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  flagEmblemBottom: {
    position: 'absolute',
    left: 9,
    bottom: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
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
    gap: 22,
  },
  googleMark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
  },
  googlePatch: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 8,
  },
  googleRed: {
    top: 5,
    right: 5,
    backgroundColor: '#ea4335',
  },
  googleYellow: {
    bottom: 8,
    right: 3,
    backgroundColor: '#fbbc05',
  },
  googleGreen: {
    bottom: 5,
    left: 7,
    backgroundColor: '#34a853',
  },
  googleText: {
    color: '#071f44',
    fontSize: 17,
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '800',
    letterSpacing: 0,
  },
  safeHands: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  safeShield: {
    width: 26,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeCheck: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  safeText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    letterSpacing: 0,
  },
});
