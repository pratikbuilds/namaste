import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appBoldFontFamily, appFontFamily, appHeavyFontFamily } from '@/theme/typography';

const navy = '#062454';
const mutedInk = '#40536d';
const softLine = 'rgba(6, 36, 84, 0.11)';

const transactions = [
  {
    merchant: 'Himalayan Cafe',
    date: 'Today, 9:41 AM',
    amount: 'NPR 1,250',
    icon: 'coffee',
    tint: '#fde9df',
  },
  {
    merchant: 'Thamel Taxi',
    date: 'Yesterday',
    amount: 'NPR 650',
    icon: 'taxi',
    tint: '#d9effb',
  },
  {
    merchant: 'Boudha Souvenir',
    date: 'May 21',
    amount: 'NPR 2,100',
    icon: 'necklace',
    tint: '#d8f4e4',
  },
] as const;

function ProfileButton() {
  return (
    <Pressable accessibilityRole="button" style={styles.profileButton}>
      <Ionicons color={navy} name="person-outline" size={24} />
      <View style={styles.notificationDot} />
    </Pressable>
  );
}

function BalanceCard() {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceText}>
        <Text selectable style={styles.balanceLabel}>
          Wallet balance
        </Text>
        <Text selectable adjustsFontSizeToFit numberOfLines={1} style={styles.balanceAmount}>
          NPR 6,660
        </Text>
        <Text selectable style={styles.usdAmount}>
          ~= USD 50.00
        </Text>
      </View>
      <View style={styles.cardShield}>
        <Ionicons color="#0b4a94" name="shield-checkmark-outline" size={29} />
      </View>
    </View>
  );
}

function ActionButton({
  kind,
  label,
  icon,
  onPress,
}: {
  kind: 'primary' | 'secondary';
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: (() => void) | undefined;
}) {
  const primary = kind === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        primary ? styles.primaryAction : styles.secondaryAction,
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons color={primary ? '#ffffff' : navy} name={icon} size={29} />
      <Text
        selectable
        style={[
          styles.actionLabel,
          primary ? styles.primaryActionText : styles.secondaryActionText,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function TransactionIcon({ icon }: { icon: (typeof transactions)[number]['icon'] }) {
  if (icon === 'necklace') {
    return (
      <View style={styles.necklaceIcon}>
        <View style={styles.necklaceCord} />
        <View style={styles.necklacePendant} />
      </View>
    );
  }

  return (
    <MaterialCommunityIcons
      color={icon === 'coffee' ? '#2d1a0f' : '#263f5d'}
      name={icon === 'coffee' ? 'coffee' : 'taxi'}
      size={28}
    />
  );
}

function TransactionList() {
  return (
    <View style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}>
        <Text selectable numberOfLines={1} style={styles.sectionTitle}>
          Recent transactions
        </Text>
        <Pressable accessibilityRole="button" style={styles.seeAll}>
          <Text selectable style={styles.seeAllText}>
            See all
          </Text>
          <Ionicons color="#0058c8" name="chevron-forward" size={20} />
        </Pressable>
      </View>

      {transactions.map((transaction, index) => (
        <View key={transaction.merchant}>
          <View style={styles.transactionRow}>
            <View style={[styles.transactionIcon, { backgroundColor: transaction.tint }]}>
              <TransactionIcon icon={transaction.icon} />
            </View>
            <View style={styles.transactionDetails}>
              <Text selectable numberOfLines={1} style={styles.transactionMerchant}>
                {transaction.merchant}
              </Text>
              <Text selectable style={styles.transactionDate}>
                {transaction.date}
              </Text>
            </View>
            <Text
              selectable
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.transactionAmount}>
              - {transaction.amount}
            </Text>
          </View>
          {index < transactions.length - 1 ? <View style={styles.transactionDivider} /> : null}
        </View>
      ))}
    </View>
  );
}

function SecurityBanner() {
  return (
    <Pressable accessibilityRole="button" style={styles.securityBanner}>
      <View style={styles.securityBadge}>
        <Ionicons color="#ffffff" name="shield-checkmark" size={22} />
      </View>
      <View style={styles.securityTextWrap}>
        <Text selectable style={styles.securityTitle}>
          Your payments are secure and private
        </Text>
        <Text selectable style={styles.securitySubtitle}>
          We never share your data
        </Text>
      </View>
      <Ionicons color={navy} name="chevron-forward" size={23} />
    </Pressable>
  );
}

function BottomTabs() {
  const tabs: Array<{
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    active: boolean;
  }> = [
    { label: 'Home', icon: 'home', active: true },
    { label: 'History', icon: 'time-outline', active: false },
    { label: 'Saved', icon: 'bookmark-outline', active: false },
    { label: 'Profile', icon: 'person-outline', active: false },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable accessibilityRole="button" key={tab.label} style={styles.tabItem}>
          <Ionicons color={tab.active ? '#0867d8' : '#304e72'} name={tab.icon} size={27} />
          <Text selectable style={[styles.tabLabel, tab.active && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function WalletHomeScreen({
  onScanQr,
  onTopUp,
}: {
  onScanQr?: () => void;
  onTopUp?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(24, Math.min(30, width * 0.06));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 18, 42),
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom + 108, 126),
          },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroCopy}>
            <Text selectable adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
              Namaste
            </Text>
            <View style={styles.redStroke} />
            <Text selectable style={styles.subtitle}>
              Ready to pay in Nepal
            </Text>
          </View>
          <ProfileButton />
        </View>

        <BalanceCard />

        <View style={styles.actionsRow}>
          <ActionButton icon="line-scan" kind="primary" label="Scan QR" onPress={onScanQr} />
          <ActionButton
            icon="wallet-plus-outline"
            kind="secondary"
            label="Top up"
            onPress={onTopUp}
          />
        </View>

        <TransactionList />
        <SecurityBanner />
      </ScrollView>
      <View style={[styles.bottomChrome, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <BottomTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#edf8fc',
    overflow: 'hidden',
  },
  scrollContent: {
    gap: 14,
  },
  heroRow: {
    minHeight: 116,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroCopy: {
    flex: 1,
    paddingTop: 6,
  },
  title: {
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 55,
  },
  redStroke: {
    width: 48,
    height: 3,
    marginTop: 4,
    marginLeft: 2,
    borderRadius: 10,
    backgroundColor: '#ed4d24',
  },
  subtitle: {
    marginTop: 10,
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0,
  },
  profileButton: {
    width: 56,
    height: 56,
    marginTop: 5,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.83)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    boxShadow: '0 9px 17px rgba(7, 31, 68, 0.13)',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#ee5531',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  balanceCard: {
    minHeight: 142,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    backgroundColor: 'rgba(255, 252, 246, 0.96)',
    overflow: 'hidden',
    boxShadow: '0 10px 26px rgba(35, 63, 91, 0.16)',
  },
  balanceText: {
    zIndex: 2,
    paddingLeft: 21,
    paddingTop: 22,
  },
  balanceLabel: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 19,
    fontWeight: '500',
    letterSpacing: 0,
  },
  balanceAmount: {
    marginTop: 18,
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 47,
  },
  usdAmount: {
    marginTop: 7,
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0,
  },
  cardShield: {
    position: 'absolute',
    top: 22,
    right: 21,
    zIndex: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  actionButton: {
    flex: 1,
    minHeight: 65,
    borderRadius: 25,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 13,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  primaryAction: {
    backgroundColor: '#004984',
    borderWidth: 2,
    borderColor: '#082c63',
    boxShadow: '0 6px 9px rgba(2, 22, 57, 0.28), inset 0 2px 5px rgba(255,255,255,0.28)',
  },
  secondaryAction: {
    backgroundColor: 'rgba(255, 252, 246, 0.73)',
    borderWidth: 1.2,
    borderColor: '#dfa83a',
  },
  actionLabel: {
    fontFamily: appBoldFontFamily,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0,
  },
  primaryActionText: {
    color: '#ffffff',
  },
  secondaryActionText: {
    color: navy,
  },
  transactionsCard: {
    borderRadius: 23,
    borderCurve: 'continuous',
    borderWidth: 1.4,
    borderColor: 'rgba(255, 255, 255, 0.98)',
    backgroundColor: 'rgba(255, 252, 246, 0.94)',
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 21,
    paddingBottom: 22,
    boxShadow: '0 13px 25px rgba(35, 63, 91, 0.14)',
  },
  transactionsHeader: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: '#0058c8',
    fontFamily: appFontFamily,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
  },
  transactionRow: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 7,
    gap: 3,
  },
  transactionMerchant: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  transactionDate: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
  },
  transactionAmount: {
    minWidth: 104,
    textAlign: 'right',
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  transactionDivider: {
    height: 1,
    backgroundColor: softLine,
  },
  necklaceIcon: {
    width: 35,
    height: 42,
    alignItems: 'center',
  },
  necklaceCord: {
    width: 25,
    height: 30,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderLeftColor: '#24362b',
    borderRightColor: '#24362b',
    borderBottomColor: '#24362b',
    borderRadius: 20,
  },
  necklacePendant: {
    width: 17,
    height: 19,
    marginTop: -8,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    backgroundColor: '#df6d2f',
    borderWidth: 2,
    borderColor: '#2d4638',
  },
  securityBanner: {
    minHeight: 61,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.96)',
    backgroundColor: 'rgba(252, 255, 255, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 18,
    boxShadow: '0 9px 16px rgba(35, 63, 91, 0.13)',
  },
  securityBadge: {
    width: 38,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#3398a8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextWrap: {
    flex: 1,
    gap: 3,
  },
  securityTitle: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  securitySubtitle: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  bottomChrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    backgroundColor: 'transparent',
  },
  tabBar: {
    minHeight: 76,
    borderRadius: 25,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'hidden',
    boxShadow: '0 15px 31px rgba(35, 63, 91, 0.17)',
  },
  tabItem: {
    width: 70,
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    color: '#18365e',
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  activeTabLabel: {
    color: '#0867d8',
  },
});
