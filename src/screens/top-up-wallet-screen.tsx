import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { appBoldFontFamily, appFontFamily, appHeavyFontFamily } from '@/theme/typography';
import exchangeArtwork from '../../assets/top-up-exchange-art.jpg';
import topUpBackground from '../../assets/top-up-wallet-bg.jpg';

const exchangeRate = 133.2;
const amountOptions = [10, 25, 50, 100] as const;
const googleIconUrl = 'https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png';
const amountInputAccessoryId = 'top-up-amount-input-accessory';
const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

const paymentOptions = [
  { id: 'apple', title: 'Apple Pay' },
  { id: 'google', title: 'Google Pay' },
  { id: 'card', title: 'Debit or credit card' },
  { id: 'more', title: 'More payment options' },
] as const;

type PaymentOptionId = (typeof paymentOptions)[number]['id'];
type AnimatedPressableProps = PressableProps & {
  haptic?: 'impact' | 'selection';
  style?: StyleProp<ViewStyle>;
};

function formatNpr(amount: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}

function cleanUsdInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [rawWhole, ...rest] = cleaned.split('.');
  const whole = rawWhole ?? '';
  const decimal = rest.join('').slice(0, 2);

  return rest.length > 0 ? `${whole}.${decimal}` : whole;
}

function formatUsdInput(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
}

function triggerHaptic(type: AnimatedPressableProps['haptic'] = 'selection') {
  if (Platform.OS === 'web') {
    return;
  }

  if (type === 'impact') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return;
  }

  void Haptics.selectionAsync();
}

function AnimatedPressable({
  haptic = 'selection',
  onPress,
  onPressIn,
  onPressOut,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function animateTo(value: number) {
    Animated.timing(scale, {
      duration: value < 1 ? 90 : 140,
      toValue: value,
      useNativeDriver: true,
    }).start();
  }

  return (
    <AnimatedPressableBase
      {...props}
      onPress={(event) => {
        triggerHaptic(haptic);
        onPress?.(event);
      }}
      onPressIn={(event) => {
        animateTo(0.97);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    />
  );
}

export function TopUpWalletRoute() {
  return (
    <SafeAreaProvider>
      <TopUpWalletScreen />
    </SafeAreaProvider>
  );
}

export function TopUpWalletScreen({
  onBack,
  onComplete,
}: {
  onBack?: () => void;
  onComplete?: () => void;
}) {
  const [usdInput, setUsdInput] = useState('50');
  const [selectedPaymentId, setSelectedPaymentId] = useState<PaymentOptionId>('apple');
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isShort = height < 780;
  const horizontalPadding = Math.max(22, Math.min(28, width * 0.061));
  const titleSize = Math.min(isShort ? 31 : 35, width * 0.084);
  const titleWidth = Math.min(238, width * 0.58);
  const usdAmount = Number.parseFloat(usdInput) || 0;
  const nprAmount = useMemo(() => Math.round(usdAmount * exchangeRate), [usdAmount]);
  const formattedNpr = formatNpr(nprAmount);
  const usdInputWidth = Math.max(42, Math.min(90, usdInput.length * 20));

  function handleAmountPreset(amount: (typeof amountOptions)[number]) {
    setUsdInput(String(amount));
  }

  function handleUsdChange(value: string) {
    setUsdInput(cleanUsdInput(value));
  }

  function handleNprChange(value: string) {
    const numericValue = value.replace(/\D/g, '');
    const nextNpr = Number.parseInt(numericValue, 10);

    if (!numericValue || !Number.isFinite(nextNpr)) {
      setUsdInput('');
      return;
    }

    setUsdInput(formatUsdInput(nextNpr / exchangeRate));
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <ImageBackground
        fadeDuration={0}
        source={topUpBackground}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <View
          style={[
            styles.content,
            {
              paddingTop: Math.max(insets.top + (isShort ? 10 : 16), isShort ? 40 : 50),
              paddingHorizontal: horizontalPadding,
              paddingBottom: Math.max(insets.bottom + 92, 104),
            },
          ]}>
          <View style={styles.header}>
            <AnimatedPressable
              accessibilityRole="button"
              onPress={onBack}
              style={styles.backButton}>
              <BackIcon />
            </AnimatedPressable>

            <View style={styles.balancePill}>
              <WalletIcon />
              <View style={styles.balanceTextWrap}>
                <Text selectable numberOfLines={1} style={styles.balanceLabel}>
                  Current balance
                </Text>
                <Text selectable numberOfLines={1} style={styles.balanceValue}>
                  NPR 0
                </Text>
              </View>
            </View>

            <View style={styles.hero}>
              <Text
                selectable
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.title, { fontSize: titleSize, maxWidth: titleWidth }]}>
                Top up wallet
              </Text>
              <View style={styles.redSwoosh} />
              <Text selectable style={styles.subtitle}>
                Ready to scan and pay
              </Text>
            </View>
          </View>

          <Text selectable style={styles.sectionTitle}>
            Choose amount
          </Text>

          <View style={styles.amountGrid}>
            {amountOptions.map((amount) => {
              const selected = amount === usdAmount;

              return (
                <AnimatedPressable
                  key={amount}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => handleAmountPreset(amount)}
                  style={[styles.amountChip, selected && styles.amountChipSelected]}>
                  {selected ? (
                    <View pointerEvents="none" style={styles.selectedAmountAccent}>
                      <View style={[styles.amountSpark, styles.amountSparkLeft]} />
                      <View style={[styles.amountSpark, styles.amountSparkCenter]} />
                      <View style={[styles.amountSpark, styles.amountSparkRight]} />
                    </View>
                  ) : null}
                  <Text
                    selectable
                    style={[styles.amountText, selected && styles.amountTextSelected]}>
                    ${amount}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <View style={styles.exchangeCard}>
            <Image
              fadeDuration={0}
              source={exchangeArtwork}
              resizeMode="cover"
              style={styles.exchangeArtwork}
            />

            <View style={styles.exchangeTop}>
              <Text selectable style={styles.smallLabel}>
                You add
              </Text>
              <View style={styles.moneyLine}>
                <Text selectable={false} style={styles.usdCurrency}>
                  $
                </Text>
                <TextInput
                  accessibilityLabel="Amount in USD"
                  inputMode="decimal"
                  inputAccessoryViewID={amountInputAccessoryId}
                  keyboardType="decimal-pad"
                  onChangeText={handleUsdChange}
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="done"
                  showSoftInputOnFocus
                  style={[styles.usdInput, { width: usdInputWidth }]}
                  value={usdInput}
                />
                <Text selectable style={styles.usdCode}>
                  USD
                </Text>
              </View>
            </View>

            <View pointerEvents="none" style={styles.cardDashLine} />
            <View style={styles.exchangeArrow}>
              <ArrowIcon />
            </View>

            <View style={styles.exchangeBottom}>
              <Text selectable style={styles.smallLabel}>
                You receive
              </Text>
              <View style={styles.nprLine}>
                <Text selectable={false} style={styles.nprCode}>
                  NPR
                </Text>
                <TextInput
                  accessibilityLabel="Amount in NPR"
                  inputMode="numeric"
                  inputAccessoryViewID={amountInputAccessoryId}
                  keyboardType="number-pad"
                  onChangeText={handleNprChange}
                  onSubmitEditing={Keyboard.dismiss}
                  returnKeyType="done"
                  showSoftInputOnFocus
                  style={styles.nprInput}
                  value={formattedNpr}
                />
              </View>
            </View>

            <View style={styles.rateDivider} />
            <View style={styles.rateRow}>
              <View style={styles.rateLeft}>
                <RefreshIcon />
                <Text selectable style={styles.rateText}>
                  1 USD = 133.20 NPR
                </Text>
              </View>
              <View style={styles.rateRight}>
                <View style={styles.greenDot} />
                <Text selectable style={styles.updatedText}>
                  Updated just now
                </Text>
              </View>
            </View>
          </View>

          <Text selectable style={styles.payWithTitle}>
            Pay with
          </Text>

          <View style={styles.paymentCard}>
            {paymentOptions.map((option, index) => {
              const selected = option.id === selectedPaymentId;

              return (
                <View key={option.id}>
                  <AnimatedPressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedPaymentId(option.id)}
                    style={[styles.paymentRow, selected && styles.paymentRowSelected]}>
                    <PaymentMark id={option.id} />
                    <Text selectable style={styles.paymentTitle}>
                      {option.title}
                    </Text>
                    <PaymentTrailing selected={selected} />
                  </AnimatedPressable>
                  {index < paymentOptions.length - 1 ? (
                    <View style={styles.paymentDivider} />
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ImageBackground>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomBar,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom + 14, 26),
          },
        ]}>
        <AnimatedPressable
          accessibilityRole="button"
          haptic="impact"
          onPress={onComplete}
          style={styles.ctaButton}>
          <WalletIcon light />
          <Text selectable style={styles.ctaText}>
            Add NPR {formattedNpr}
          </Text>
        </AnimatedPressable>
      </View>

      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID={amountInputAccessoryId}>
          <View style={styles.keyboardAccessory}>
            <AnimatedPressable
              accessibilityRole="button"
              onPress={Keyboard.dismiss}
              style={styles.keyboardDoneButton}>
              <Text style={styles.keyboardDoneText}>Done</Text>
            </AnimatedPressable>
          </View>
        </InputAccessoryView>
      ) : null}
    </View>
  );
}

function BackIcon() {
  return (
    <View style={styles.backIcon}>
      <View style={styles.backStem} />
      <View style={[styles.backArm, styles.backArmTop]} />
      <View style={[styles.backArm, styles.backArmBottom]} />
    </View>
  );
}

function WalletIcon({ light = false }: { light?: boolean }) {
  return (
    <View style={[styles.walletIcon, light && styles.walletIconLight]}>
      <View style={[styles.walletLid, light && styles.walletStrokeLight]} />
      <View style={[styles.walletButton, light && styles.walletStrokeLight]} />
    </View>
  );
}

function ArrowIcon() {
  return <Text style={styles.arrowGlyph}>→</Text>;
}

function RefreshIcon() {
  return <Text style={styles.refreshGlyph}>↻</Text>;
}

function CheckMark({ color, size }: { color: string; size: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.checkStem,
          {
            backgroundColor: color,
            width: size * 0.4,
            height: Math.max(3, size * 0.15),
            left: size * 0.08,
            top: size * 0.52,
          },
        ]}
      />
      <View
        style={[
          styles.checkArm,
          {
            backgroundColor: color,
            width: size * 0.72,
            height: Math.max(3, size * 0.15),
            left: size * 0.28,
            top: size * 0.42,
          },
        ]}
      />
    </View>
  );
}

function PaymentMark({ id }: { id: PaymentOptionId }) {
  if (id === 'google') {
    return (
      <View style={styles.payBadge}>
        <GooglePayMark />
        <Text selectable={false} numberOfLines={1} style={styles.payWord}>
          Pay
        </Text>
      </View>
    );
  }

  if (id === 'card') {
    return (
      <View style={styles.cardMarkWrap}>
        <View style={styles.cardMark}>
          <View style={styles.cardStripe} />
          <View style={styles.cardLineWide} />
          <View style={styles.cardLineShort} />
        </View>
        <View style={styles.cardNetworks}>
          <Text style={styles.visaText}>VISA</Text>
          <View style={styles.mastercardWrap}>
            <View style={[styles.mastercardDot, { backgroundColor: '#ef3f2f' }]} />
            <View style={[styles.mastercardDot, styles.mastercardSecond]} />
          </View>
        </View>
      </View>
    );
  }

  if (id === 'more') {
    return (
      <View style={styles.moreMark}>
        <Text style={styles.moreDots}>...</Text>
      </View>
    );
  }

  return (
    <View style={styles.payBadge}>
      <Text selectable={false} style={styles.appleGlyph}>
        
      </Text>
      <Text selectable={false} numberOfLines={1} style={styles.payWord}>
        Pay
      </Text>
    </View>
  );
}

function GooglePayMark() {
  return (
    <View style={styles.googleMark}>
      <Image source={{ uri: googleIconUrl }} resizeMode="contain" style={styles.googleIconImage} />
    </View>
  );
}

function PaymentTrailing({ selected }: { selected?: boolean }) {
  if (selected) {
    return (
      <View style={styles.selectedCircle}>
        <CheckMark color="#ffffff" size={13} />
      </View>
    );
  }

  return <Text style={styles.chevron}>{'>'}</Text>;
}

const navy = '#061c4a';
const ink = '#071d42';
const red = '#f24522';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#eef7ff',
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
  content: {
    flex: 1,
    gap: 10,
  },
  header: {
    height: 134,
  },
  backButton: {
    position: 'absolute',
    left: -6,
    top: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 34,
    height: 28,
    justifyContent: 'center',
  },
  backStem: {
    width: 34,
    height: 4,
    borderRadius: 4,
    backgroundColor: navy,
  },
  backArm: {
    position: 'absolute',
    left: -2,
    width: 18,
    height: 4,
    borderRadius: 4,
    backgroundColor: navy,
  },
  backArmTop: {
    top: 6,
    transform: [{ rotate: '-45deg' }],
  },
  backArmBottom: {
    bottom: 6,
    transform: [{ rotate: '45deg' }],
  },
  balancePill: {
    position: 'absolute',
    top: -7,
    right: 0,
    width: 136,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(194, 203, 214, 0.72)',
    borderRadius: 17,
    paddingVertical: 7,
    paddingHorizontal: 9,
    backgroundColor: 'rgba(249, 251, 253, 0.86)',
    boxShadow: '0 8px 18px rgba(14, 33, 66, 0.05)',
  },
  walletIcon: {
    width: 18,
    height: 15,
    borderWidth: 2,
    borderColor: navy,
    borderRadius: 5,
    borderCurve: 'continuous',
  },
  walletIconLight: {
    width: 28,
    height: 22,
    borderColor: '#ffffff',
  },
  walletLid: {
    position: 'absolute',
    top: 2,
    left: -2,
    width: 10,
    height: 6,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: navy,
    borderTopLeftRadius: 5,
  },
  walletButton: {
    position: 'absolute',
    right: -3,
    top: 4,
    width: 8,
    height: 6,
    borderWidth: 2,
    borderColor: navy,
    borderRadius: 4,
  },
  walletStrokeLight: {
    borderColor: '#ffffff',
  },
  balanceTextWrap: {
    flex: 1,
    gap: 1,
  },
  balanceLabel: {
    color: ink,
    fontFamily: appFontFamily,
    fontSize: 10.5,
    letterSpacing: 0,
  },
  balanceValue: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 19,
  },
  hero: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    gap: 10,
  },
  title: {
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 42,
  },
  redSwoosh: {
    width: 38,
    height: 3,
    marginLeft: 1,
    borderRadius: 999,
    backgroundColor: red,
    transform: [{ skewX: '-18deg' }],
  },
  subtitle: {
    color: '#3a4d66',
    fontFamily: appFontFamily,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 21,
  },
  sectionTitle: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  amountChip: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196, 199, 201, 0.8)',
    borderRadius: 14,
    backgroundColor: 'rgba(255, 252, 247, 0.9)',
    boxShadow: '0 6px 14px rgba(25, 35, 55, 0.08)',
  },
  selectedAmountAccent: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 34,
    height: 18,
  },
  amountSpark: {
    position: 'absolute',
    width: 3,
    height: 10,
    borderRadius: 4,
    backgroundColor: red,
  },
  amountSparkLeft: {
    left: 4,
    top: 7,
    transform: [{ rotate: '-38deg' }],
  },
  amountSparkCenter: {
    left: 15,
    top: 1,
  },
  amountSparkRight: {
    right: 4,
    top: 7,
    transform: [{ rotate: '38deg' }],
  },
  amountChipSelected: {
    borderColor: '#0c3772',
    backgroundColor: '#062f69',
    boxShadow: '0 10px 20px rgba(0, 38, 94, 0.22)',
  },
  amountText: {
    color: '#20252e',
    fontFamily: appFontFamily,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  amountTextSelected: {
    color: '#ffffff',
    fontFamily: appBoldFontFamily,
    fontWeight: '600',
  },
  exchangeCard: {
    minHeight: 188,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 226, 222, 0.92)',
    borderRadius: 14,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 9,
    backgroundColor: 'rgba(255, 249, 238, 0.97)',
    boxShadow: '0 8px 18px rgba(42, 44, 55, 0.06)',
  },
  exchangeArtwork: {
    position: 'absolute',
    top: 9,
    right: -10,
    width: '74%',
    height: 92,
    opacity: 0.95,
  },
  exchangeTop: {
    gap: 5,
  },
  smallLabel: {
    color: '#294469',
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  moneyLine: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  usdCurrency: {
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 44,
  },
  usdInput: {
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 44,
    includeFontPadding: false,
  },
  usdCode: {
    marginLeft: 2,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  cardDashLine: {
    position: 'absolute',
    top: 78,
    left: 16,
    right: 16,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(185, 175, 156, 0.58)',
  },
  exchangeArrow: {
    position: 'absolute',
    top: 63,
    alignSelf: 'center',
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(216, 218, 218, 0.9)',
    borderRadius: 999,
    backgroundColor: '#fffcf8',
    boxShadow: '0 8px 16px rgba(23, 33, 47, 0.12)',
  },
  arrowGlyph: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  exchangeBottom: {
    marginTop: 9,
    gap: 4,
  },
  nprLine: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nprCode: {
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 48,
  },
  nprInput: {
    flex: 1,
    height: 54,
    minWidth: 168,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 48,
    includeFontPadding: false,
  },
  rateDivider: {
    height: 1,
    marginTop: 8,
    backgroundColor: 'rgba(204, 199, 189, 0.76)',
  },
  rateRow: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshGlyph: {
    width: 22,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  rateText: {
    color: navy,
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  rateRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#26a66f',
  },
  updatedText: {
    color: '#294469',
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  payWithTitle: {
    marginTop: 0,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  paymentCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(218, 218, 213, 0.94)',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 252, 247, 0.94)',
    boxShadow: '0 16px 30px rgba(35, 45, 65, 0.12)',
  },
  paymentRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },
  paymentRowSelected: {
    backgroundColor: 'rgba(226, 238, 252, 0.28)',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: 'rgba(213, 205, 194, 0.78)',
  },
  payBadge: {
    width: 50,
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderWidth: 1,
    borderColor: 'rgba(212, 212, 212, 0.85)',
    borderRadius: 8,
    backgroundColor: '#fffefa',
    boxShadow: '0 4px 10px rgba(28, 33, 45, 0.08)',
  },
  appleGlyph: {
    color: '#050505',
    fontFamily: appBoldFontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  payWord: {
    color: '#111111',
    fontFamily: appBoldFontFamily,
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: 0,
  },
  googleMark: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconImage: {
    width: 17,
    height: 17,
  },
  googleLetter: {
    color: '#4285f4',
    fontFamily: appBoldFontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 20,
  },
  googleDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  googleRed: {
    top: 2,
    right: 2,
    backgroundColor: '#ea4335',
  },
  googleYellow: {
    right: 1,
    bottom: 3,
    backgroundColor: '#fbbc05',
  },
  googleGreen: {
    left: 3,
    bottom: 1,
    backgroundColor: '#34a853',
  },
  cardMarkWrap: {
    width: 49,
    alignItems: 'center',
    gap: 2,
  },
  cardMark: {
    width: 35,
    height: 23,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#11346d',
  },
  cardStripe: {
    height: 5,
    marginTop: 5,
    backgroundColor: '#ffffff',
  },
  cardLineWide: {
    width: 15,
    height: 2,
    marginTop: 7,
    marginLeft: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  cardLineShort: {
    position: 'absolute',
    right: 5,
    bottom: 6,
    width: 6,
    height: 2,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  cardNetworks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  visaText: {
    color: '#153271',
    fontFamily: appBoldFontFamily,
    fontSize: 7,
    fontWeight: '600',
  },
  mastercardWrap: {
    width: 16,
    height: 8,
    flexDirection: 'row',
  },
  mastercardDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  mastercardSecond: {
    marginLeft: -4,
    backgroundColor: '#f3a019',
  },
  moreMark: {
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 212, 212, 0.85)',
    borderRadius: 8,
    backgroundColor: '#fffefa',
    boxShadow: '0 4px 10px rgba(28, 33, 45, 0.08)',
  },
  moreDots: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 4,
  },
  paymentTitle: {
    flex: 1,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  selectedCircle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#0d3974',
  },
  chevron: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 23,
    fontWeight: '600',
    lineHeight: 31,
  },
  rateBadge: {
    alignSelf: 'flex-start',
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 216, 0.88)',
    borderRadius: 13,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 252, 244, 0.92)',
    boxShadow: '0 10px 22px rgba(23, 33, 47, 0.11)',
  },
  shieldBadge: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#2b8f70',
  },
  checkStem: {
    position: 'absolute',
    borderRadius: 4,
    transform: [{ rotate: '42deg' }],
  },
  checkArm: {
    position: 'absolute',
    borderRadius: 4,
    transform: [{ rotate: '-48deg' }],
  },
  rateBadgeText: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: 0,
  },
  bottomBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingTop: 10,
    backgroundColor: 'rgba(255, 248, 237, 0.02)',
  },
  keyboardAccessory: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: 'rgba(195, 202, 214, 0.75)',
    paddingHorizontal: 14,
    backgroundColor: 'rgba(248, 250, 253, 0.98)',
  },
  keyboardDoneButton: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  keyboardDoneText: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  ctaButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.46)',
    borderRadius: 999,
    backgroundColor: '#052f69',
    boxShadow: '0 16px 34px rgba(0, 34, 84, 0.35)',
  },
  ctaText: {
    color: '#ffffff',
    fontFamily: appHeavyFontFamily,
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
