import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const animatedEaseOut = Easing.bezier(0.23, 1, 0.32, 1);

type StepMetrics = {
  artworkSize: number;
  cardHeight: number;
  titleSize: number;
  subtitleSize: number;
};

type PolishedPressableProps = PressableProps & {
  haptic?: Haptics.ImpactFeedbackStyle | false;
  pressScale?: number;
  style?: StyleProp<ViewStyle>;
};

function triggerHaptic(style: Haptics.ImpactFeedbackStyle) {
  void Haptics.impactAsync(style).catch(() => undefined);
}

function PolishedPressable({
  haptic = Haptics.ImpactFeedbackStyle.Light,
  onPressIn,
  onPressOut,
  pressScale = 0.97,
  style,
  ...props
}: PolishedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn(event: GestureResponderEvent) {
    scale.value = withTiming(pressScale, { duration: 120, easing: animatedEaseOut });
    if (haptic) {
      triggerHaptic(haptic);
    }
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    scale.value = withTiming(1, { duration: 150, easing: animatedEaseOut });
    onPressOut?.(event);
  }

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );
}

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
  const horizontalPadding = Math.max(32, width * 0.085);
  const backgroundHeight = height * 0.96;
  const cardMetrics: StepMetrics = {
    artworkSize: compact ? 96 : 100,
    cardHeight: compact ? 128 : 136,
    titleSize: compact ? 16 : 16,
    subtitleSize: compact ? 15 : 15,
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
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
          <PolishedPressable
            accessibilityRole="button"
            haptic={Haptics.ImpactFeedbackStyle.Light}
            hitSlop={12}
            onPress={onBack}
            pressScale={0.92}
            style={styles.navButton}>
            <View style={styles.backGlyph}>
              <View style={styles.backStrokeTop} />
              <View style={styles.backStrokeBottom} />
            </View>
          </PolishedPressable>
        </View>

        <View style={[styles.header, { marginTop: compact ? 24 : 34 }]}>
          <Text style={[styles.title, { fontSize: Math.min(42, width * 0.107) }]}>
            How it works
          </Text>
          <View style={styles.redDash} />
        </View>

        <View style={[styles.cards, { gap: compact ? 13 : 14, marginTop: compact ? 20 : 26 }]}>
          {steps.map((step, index) => (
            <StepCard key={step.number} index={index} step={step} metrics={cardMetrics} />
          ))}
        </View>

        <PolishedPressable
          accessibilityRole="button"
          haptic={Haptics.ImpactFeedbackStyle.Medium}
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
          <View style={styles.continueHighlight} />
          <Text style={styles.continueText}>Continue</Text>
        </PolishedPressable>
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
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    width: 25,
    height: 25,
    justifyContent: 'center',
  },
  backStrokeTop: {
    position: 'absolute',
    left: 3,
    top: 5,
    width: 17,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#061d4b',
    transform: [{ rotate: '-45deg' }],
  },
  backStrokeBottom: {
    position: 'absolute',
    left: 3,
    bottom: 5,
    width: 17,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#061d4b',
    transform: [{ rotate: '45deg' }],
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
  redDash: {
    width: 64,
    height: 5,
    marginTop: 13,
    marginLeft: 2,
    borderRadius: 999,
    backgroundColor: '#d82017',
    transform: [{ scaleX: 1.22 }],
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
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.42)',
    backgroundColor: '#002b67',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 13px 24px rgba(0, 24, 62, 0.38)',
  },
  continueHighlight: {
    position: 'absolute',
    left: 28,
    right: 28,
    top: 2,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  continueText: {
    color: '#ffffff',
    fontSize: 25,
    fontFamily: appFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 34,
  },
});
