import { StatusBar } from 'expo-status-bar';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrangeDash } from '@/components/orange-dash';
import {
  googleIconUrl,
  onboardingBackground,
  onboardingFeatures,
} from '@/navigation/screen-assets';
import { getFlowHorizontalPadding } from '@/theme/flow-layout';
import { appFontFamily } from '@/theme/typography';
import { triggerImpactHaptic } from '@/utils/haptics';

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
  const horizontalPadding = getFlowHorizontalPadding(width);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
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
            <OrangeDash variant="hero" style={styles.orangeDash} />
            <Text selectable style={[styles.subtitle, { fontSize: Math.min(20, width * 0.052) }]}>
              Pay any QR in Nepal{'\n'}instantly
            </Text>
          </View>

          <View
            style={[
              styles.bottomControls,
              {
                bottom: Math.max(insets.bottom + 18, 40),
                left: horizontalPadding,
                right: horizontalPadding,
              },
            ]}>
            <View style={styles.featureCard}>
              {onboardingFeatures.map((feature, index) => (
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
                  {index < onboardingFeatures.length - 1 ? <View style={styles.divider} /> : null}
                </View>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                triggerImpactHaptic();
                onContinue();
              }}
              style={styles.googleButton}>
              <View pointerEvents="none" style={styles.googleButtonHighlight} />
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
  orangeDash: {
    marginTop: 7,
    marginLeft: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    overflow: 'hidden',
    boxShadow: '0 16px 34px rgba(0, 34, 84, 0.18)',
  },
  googleButtonHighlight: {
    position: 'absolute',
    top: 2,
    right: 28,
    left: 28,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
  },
  googleMark: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  googleIconImage: {
    width: 26,
    height: 26,
  },
  googleText: {
    color: '#071f44',
    fontSize: 21,
    fontFamily: appFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
