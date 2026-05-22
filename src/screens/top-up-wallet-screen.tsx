import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const amountOptions = ['$10', '$25', '$50', '$100'] as const;

const paymentOptions = [
  { id: 'apple', title: 'Apple Pay', selected: true },
  { id: 'google', title: 'Google Pay', selected: false },
  { id: 'card', title: 'Debit or credit card', selected: false },
  { id: 'more', title: 'More payment options', selected: false },
] as const;

type PaymentOptionId = (typeof paymentOptions)[number]['id'];

export function TopUpWalletRoute() {
  return (
    <SafeAreaProvider>
      <TopUpWalletScreen />
    </SafeAreaProvider>
  );
}

export function TopUpWalletScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(28, Math.min(30, width * 0.066));
  const titleSize = Math.min(38, width * 0.089);
  const titleWidth = Math.min(230, width * 0.535);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 25, 56),
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom + 112, 132),
          },
        ]}>
        <View style={styles.header}>
          <Pressable style={[styles.backButton, { top: 3 }]}>
            <BackIcon />
          </Pressable>

          <View style={styles.balancePill}>
            <WalletIcon />
            <View style={styles.balanceTextWrap}>
              <Text selectable style={styles.balanceLabel}>
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
            const selected = amount === '$50';

            return (
              <Pressable
                key={amount}
                style={[styles.amountChip, selected && styles.amountChipSelected]}>
                <Text selectable style={[styles.amountText, selected && styles.amountTextSelected]}>
                  {amount}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.exchangeCard}>
          <View style={styles.sparkWrap}>
            <View style={[styles.spark, styles.sparkLeft]} />
            <View style={[styles.spark, styles.sparkCenter]} />
            <View style={[styles.spark, styles.sparkRight]} />
          </View>

          <View style={styles.exchangeTop}>
            <Text selectable style={styles.smallLabel}>
              You add
            </Text>
            <View style={styles.moneyLine}>
              <Text selectable style={styles.usdAmount}>
                $50
              </Text>
              <Text selectable style={styles.usdCode}>
                USD
              </Text>
            </View>
          </View>

          <View style={styles.cardDashLine} />
          <View style={styles.exchangeArrow}>
            <ArrowIcon />
          </View>

          <View style={styles.exchangeBottom}>
            <Text selectable style={styles.smallLabel}>
              You receive
            </Text>
            <Text selectable style={styles.nprAmount}>
              NPR 6,660
            </Text>
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
          {paymentOptions.map((option, index) => (
            <View key={option.id}>
              <Pressable style={styles.paymentRow}>
                <PaymentMark id={option.id} />
                <Text selectable style={styles.paymentTitle}>
                  {option.title}
                </Text>
                <PaymentTrailing selected={option.selected} />
              </Pressable>
              {index < paymentOptions.length - 1 ? <View style={styles.paymentDivider} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.rateBadge}>
          <View style={styles.shieldBadge}>
            <CheckMark color="#ffffff" size={19} />
          </View>
          <Text selectable style={styles.rateBadgeText}>
            Rate shown before you pay
          </Text>
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomBar,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom + 14, 26),
          },
        ]}>
        <Pressable style={styles.ctaButton}>
          <WalletIcon light />
          <Text selectable style={styles.ctaText}>
            Add NPR 6,660
          </Text>
        </Pressable>
      </View>
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
  return (
    <View style={styles.arrowIcon}>
      <View style={styles.arrowLine} />
      <View style={[styles.arrowHead, styles.arrowHeadTop]} />
      <View style={[styles.arrowHead, styles.arrowHeadBottom]} />
    </View>
  );
}

function RefreshIcon() {
  return (
    <View style={styles.refreshIcon}>
      <View style={styles.refreshArcTop} />
      <View style={styles.refreshArcBottom} />
      <View style={styles.refreshArrowTop} />
      <View style={styles.refreshArrowBottom} />
    </View>
  );
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
      <Text selectable={false} style={styles.googleLetter}>
        G
      </Text>
      <View style={[styles.googleDot, styles.googleRed]} />
      <View style={[styles.googleDot, styles.googleYellow]} />
      <View style={[styles.googleDot, styles.googleGreen]} />
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
    backgroundColor: '#fbf5eb',
  },
  content: {
    gap: 14,
  },
  header: {
    height: 130,
  },
  backButton: {
    position: 'absolute',
    left: -6,
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
    top: 8,
    right: 0,
    width: 140,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(194, 203, 214, 0.72)',
    borderRadius: 19,
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(246, 248, 250, 0.82)',
    boxShadow: '0 12px 24px rgba(14, 33, 66, 0.08)',
  },
  walletIcon: {
    width: 20,
    height: 16,
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
    width: 12,
    height: 7,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: navy,
    borderTopLeftRadius: 5,
  },
  walletButton: {
    position: 'absolute',
    right: -3,
    top: 5,
    width: 9,
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
    gap: 2,
  },
  balanceLabel: {
    color: ink,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 11.5,
    letterSpacing: 0,
  },
  balanceValue: {
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 22,
  },
  hero: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    gap: 10,
  },
  title: {
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 50,
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
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
  },
  sectionTitle: {
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  amountGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  amountChip: {
    flex: 1,
    minHeight: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(196, 199, 201, 0.8)',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 252, 247, 0.9)',
    boxShadow: '0 6px 14px rgba(25, 35, 55, 0.08)',
  },
  amountChipSelected: {
    borderColor: '#0c3772',
    backgroundColor: '#062f69',
    boxShadow: '0 10px 20px rgba(0, 38, 94, 0.22)',
  },
  amountText: {
    color: '#20252e',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  amountTextSelected: {
    color: '#ffffff',
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '700',
  },
  exchangeCard: {
    minHeight: 216,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(226, 226, 222, 0.92)',
    borderRadius: 13,
    paddingTop: 20,
    paddingHorizontal: 17,
    paddingBottom: 11,
    backgroundColor: 'rgba(255, 251, 244, 0.94)',
    boxShadow: '0 18px 38px rgba(42, 44, 55, 0.13)',
  },
  sparkWrap: {
    position: 'absolute',
    top: -2,
    alignSelf: 'center',
    width: 42,
    height: 28,
  },
  spark: {
    position: 'absolute',
    width: 3,
    height: 12,
    borderRadius: 4,
    backgroundColor: red,
  },
  sparkLeft: {
    left: 4,
    top: 13,
    transform: [{ rotate: '-38deg' }],
  },
  sparkCenter: {
    left: 20,
    top: 4,
  },
  sparkRight: {
    right: 4,
    top: 13,
    transform: [{ rotate: '38deg' }],
  },
  exchangeTop: {
    gap: 10,
  },
  smallLabel: {
    color: '#294469',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  moneyLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  usdAmount: {
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
  },
  usdCode: {
    paddingBottom: 5,
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  cardDashLine: {
    marginTop: 18,
    width: '55%',
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(185, 175, 156, 0.68)',
  },
  exchangeArrow: {
    position: 'absolute',
    top: 79,
    alignSelf: 'center',
    width: 41,
    height: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(216, 218, 218, 0.9)',
    borderRadius: 999,
    backgroundColor: '#fffcf8',
    boxShadow: '0 10px 20px rgba(23, 33, 47, 0.13)',
  },
  arrowIcon: {
    width: 30,
    height: 24,
    justifyContent: 'center',
  },
  arrowLine: {
    width: 29,
    height: 3,
    borderRadius: 4,
    backgroundColor: navy,
  },
  arrowHead: {
    position: 'absolute',
    right: -1,
    width: 14,
    height: 3,
    borderRadius: 4,
    backgroundColor: navy,
  },
  arrowHeadTop: {
    top: 6,
    transform: [{ rotate: '45deg' }],
  },
  arrowHeadBottom: {
    bottom: 6,
    transform: [{ rotate: '-45deg' }],
  },
  exchangeBottom: {
    marginTop: 16,
    gap: 10,
  },
  nprAmount: {
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 39,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 43,
  },
  rateDivider: {
    height: 1,
    marginTop: 10,
    backgroundColor: 'rgba(204, 199, 189, 0.76)',
  },
  rateRow: {
    minHeight: 31,
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
  refreshIcon: {
    width: 20,
    height: 20,
  },
  refreshArcTop: {
    position: 'absolute',
    top: 5,
    left: 6,
    width: 14,
    height: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: navy,
    borderRadius: 999,
  },
  refreshArcBottom: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 14,
    height: 14,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: navy,
    borderRadius: 999,
  },
  refreshArrowTop: {
    position: 'absolute',
    top: 4,
    right: 3,
    width: 6,
    height: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: navy,
    transform: [{ rotate: '26deg' }],
  },
  refreshArrowBottom: {
    position: 'absolute',
    bottom: 4,
    left: 3,
    width: 6,
    height: 6,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: navy,
    transform: [{ rotate: '26deg' }],
  },
  rateText: {
    color: navy,
    fontFamily: 'AvenirNext-Medium',
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
    fontFamily: 'AvenirNext-Medium',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  payWithTitle: {
    marginTop: 0,
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  paymentCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(218, 218, 213, 0.94)',
    borderRadius: 13,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 252, 247, 0.94)',
    boxShadow: '0 16px 30px rgba(35, 45, 65, 0.12)',
  },
  paymentRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
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
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  payWord: {
    color: '#111111',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0,
  },
  googleMark: {
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    color: '#4285f4',
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 17,
    fontWeight: '800',
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
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 7,
    fontWeight: '800',
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
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 4,
  },
  paymentTitle: {
    flex: 1,
    color: navy,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    fontWeight: '700',
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
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 31,
  },
  rateBadge: {
    alignSelf: 'flex-start',
    minHeight: 39,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(222, 222, 216, 0.88)',
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 17,
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
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0,
  },
  bottomBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    paddingTop: 14,
    backgroundColor: 'rgba(255, 248, 237, 0.02)',
  },
  ctaButton: {
    minHeight: 58,
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
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
