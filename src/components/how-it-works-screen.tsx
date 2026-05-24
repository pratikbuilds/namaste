import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlowBackIcon } from '@/components/flow-back-icon';
import { OrangeDash } from '@/components/orange-dash';
import { PressableScale } from '@/components/pressable-scale';
import { getFlowHorizontalPadding } from '@/theme/flow-layout';
import { primaryCtaButtonStyle, primaryCtaTextStyle } from '@/theme/primary-cta';
import { appFontFamily } from '@/theme/typography';
import howItWorksBackground from '../../assets/how-it-works-bg.jpg';
import loadMoneyArtwork from '../../assets/how-it-works-load-money.jpg';
import payInstantlyArtwork from '../../assets/how-it-works-pay-instantly.jpg';
import scanFonePayArtwork from '../../assets/how-it-works-scan-fonepay.jpg';

const steps = [
  {
    number: '1',
    tone: '#082e75',
    title: 'Load money',
    subtitle: 'Use your card or Apple Pay',
    artwork: loadMoneyArtwork,
  },
  {
    number: '2',
    tone: '#d9302c',
    title: 'Scan any FonePay QR',
    subtitle: 'Restaurants, shops, taxis',
    artwork: scanFonePayArtwork,
  },
  {
    number: '3',
    tone: '#2f9a78',
    title: 'Pay instantly',
    subtitle: 'No local bank account needed',
    artwork: payInstantlyArtwork,
  },
] as const;

const animatedEaseOut = Easing.bezier(0.23, 1, 0.32, 1);

type StepMetrics = {
  artworkSize: number;
  cardHeight: number;
  titleSize: number;
  subtitleSize: number;
};

function StepArtwork({ step, artworkSize }: { step: (typeof steps)[number]; artworkSize: number }) {
  return (
    <View style={[styles.artFrame, { width: artworkSize, height: artworkSize }]}>
      <Image fadeDuration={0} source={step.artwork} resizeMode="cover" style={styles.artImage} />
    </View>
  );
}

function StepChip({ step }: { step: (typeof steps)[number] }) {
  return (
    <View style={styles.stepChipRow}>
      <View style={[styles.stepChip, { backgroundColor: step.tone }]}>
        <Text style={styles.stepChipText}>{step.number}</Text>
      </View>
      <View style={[styles.stepRule, { backgroundColor: step.tone }]} />
    </View>
  );
}

function StepCard({
  index,
  step,
  metrics,
}: {
  index: number;
  step: (typeof steps)[number];
  metrics: StepMetrics;
}) {
  const enterProgress = useSharedValue(0);
  const enterStyle = useAnimatedStyle(() => ({
    opacity: enterProgress.value,
    transform: [{ translateY: (1 - enterProgress.value) * 10 }],
  }));

  useEffect(() => {
    enterProgress.value = withDelay(
      index * 55,
      withTiming(1, { duration: 260, easing: animatedEaseOut })
    );
  }, [enterProgress, index]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          height: metrics.cardHeight,
        },
        enterStyle,
      ]}>
      <StepArtwork step={step} artworkSize={metrics.artworkSize} />
      <View style={styles.cardTextBlock}>
        <StepChip step={step} />
        <View style={styles.cardTitleRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.88}
            style={[styles.cardTitle, { fontSize: metrics.titleSize }]}>
            {step.title}
          </Text>
        </View>
        <Text style={[styles.cardSubtitle, { fontSize: metrics.subtitleSize }]}>
          {step.subtitle}
        </Text>
      </View>
    </Animated.View>
  );
}

export function HowItWorksScreen({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = height < 820;
  const horizontalPadding = getFlowHorizontalPadding(width);
  const backgroundHeight = height * 0.96;
  const cardMetrics: StepMetrics = {
    artworkSize: compact ? 96 : 100,
    cardHeight: compact ? 128 : 136,
    titleSize: compact ? 16 : 16,
    subtitleSize: compact ? 15 : 15,
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Image
        fadeDuration={0}
        source={howItWorksBackground}
        resizeMode="stretch"
        style={styles.backgroundBaseImage}
      />
      <Image
        fadeDuration={0}
        source={howItWorksBackground}
        resizeMode="stretch"
        style={[
          styles.backgroundImage,
          {
            width,
            height: backgroundHeight,
            left: 0,
            top: 0,
          },
        ]}
      />
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 8, compact ? 54 : 66),
            paddingBottom: Math.max(insets.bottom + 14, 28),
            paddingHorizontal: horizontalPadding,
          },
        ]}>
        <View style={styles.nav}>
          <PressableScale
            accessibilityRole="button"
            haptic="impact"
            hitSlop={12}
            onPress={onBack}
            pressScale={0.92}
            style={styles.navButton}>
            <FlowBackIcon />
          </PressableScale>
        </View>

        <View style={[styles.header, { marginTop: compact ? 24 : 34 }]}>
          <Text style={[styles.title, { fontSize: Math.min(42, width * 0.107) }]}>
            How it works
          </Text>
          <OrangeDash variant="section" style={styles.orangeDash} />
        </View>

        <View style={[styles.cards, { gap: compact ? 13 : 14, marginTop: compact ? 20 : 26 }]}>
          {steps.map((step, index) => (
            <StepCard key={step.number} index={index} step={step} metrics={cardMetrics} />
          ))}
        </View>

        <PressableScale
          accessibilityRole="button"
          haptic="impact"
          onPress={onContinue}
          pressScale={0.975}
          style={[
            styles.continueButton,
            {
              right: horizontalPadding,
              bottom: Math.max(insets.bottom + 18, 40),
              left: horizontalPadding,
              height: compact ? 62 : 68,
            },
          ]}>
          <Text style={styles.continueText}>Continue</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5ead8',
    overflow: 'hidden',
  },
  backgroundBaseImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
  },
  content: {
    flex: 1,
  },
  nav: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#061d4b',
    fontSize: 19,
    fontFamily: appFontFamily,
    fontWeight: '600',
    lineHeight: 28,
  },
  header: {
    alignItems: 'flex-start',
  },
  title: {
    color: '#061d4b',
    fontFamily: appFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 50,
  },
  orangeDash: {
    marginTop: 7,
    marginLeft: 2,
  },
  cards: {},
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 21,
    backgroundColor: 'rgba(255, 252, 245, 0.96)',
    boxShadow: '0 7px 20px rgba(37, 34, 24, 0.13)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
    paddingRight: 16,
    gap: 18,
  },
  artFrame: {
    borderRadius: 16,
    backgroundColor: '#dcecf5',
    overflow: 'hidden',
  },
  artImage: {
    width: '100%',
    height: '100%',
  },
  stepChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepChip: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 -2px 3px rgba(0, 0, 0, 0.18)',
  },
  stepChipText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: appFontFamily,
    fontWeight: '600',
    lineHeight: 20,
  },
  stepRule: {
    width: 26,
    height: 3,
    borderRadius: 999,
    opacity: 0.42,
  },
  cardTextBlock: {
    flex: 1,
    gap: 6,
  },
  cardTitleRow: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    color: '#061d4b',
    fontFamily: appFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 24,
  },
  cardSubtitle: {
    color: '#25395e',
    fontFamily: appFontFamily,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 23,
  },
  continueButton: {
    position: 'absolute',
    ...primaryCtaButtonStyle,
  },
  continueText: {
    ...primaryCtaTextStyle,
    lineHeight: 30,
  },
});
