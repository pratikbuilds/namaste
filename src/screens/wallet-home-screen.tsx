import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrangeDash } from '@/components/orange-dash';
import { PressableScale } from '@/components/pressable-scale';
import { WalletNavbar } from '@/components/wallet-navbar';
import { useWallet } from '@/context/wallet-context';
import {
  defaultWalletHomeState,
  getWalletHomeTabTitle,
  type WalletHomeState,
  type WalletHomeTab,
  type WalletTransactionIcon,
} from '@/data/wallet-home';
import { appColors, appMotion, appSurfaces } from '@/theme/design';
import { appBoldFontFamily, appFontFamily, appHeavyFontFamily } from '@/theme/typography';
import { triggerSelectionHaptic } from '@/utils/haptics';
import walletBalanceArt from '../../assets/wallet-balance-art.png';
import walletHomeBg from '../../assets/wallet-home-bg.png';
import walletSecurityArt from '../../assets/wallet-security-art.png';

const navy = appColors.navy;
const mutedInk = appColors.mutedInk;
const softLine = appColors.softLine;

function StaggeredSection({ children, index }: { children: ReactNode; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      {...(reduceMotion
        ? {}
        : {
            entering: FadeInUp.delay(index * 45)
              .duration(190)
              .easing(Easing.out(Easing.cubic)),
          })}>
      {children}
    </Animated.View>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons color="#0b4a94" name={icon} size={25} />
      </View>
      <Text selectable style={styles.emptyStateTitle}>
        {title}
      </Text>
      <Text selectable style={styles.emptyStateSubtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

function BalanceCard({ balance }: { balance: WalletHomeState['balance'] }) {
  return (
    <View style={styles.balanceCard}>
      <Image resizeMode="cover" source={walletBalanceArt} style={styles.balanceArt} />
      <View style={styles.balanceScrim} />
      <View style={styles.balanceText}>
        <Text selectable style={styles.balanceLabel}>
          Wallet balance
        </Text>
        <Text selectable allowFontScaling={false} numberOfLines={1} style={styles.balanceAmount}>
          {balance.npr}
        </Text>
        <Text selectable style={styles.usdAmount}>
          {balance.usdEquivalent}
        </Text>
      </View>
      <OrangeDash variant="compact" style={styles.balanceDash} />
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
  width,
}: {
  kind: 'primary' | 'secondary';
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: (() => void) | undefined;
  width: number;
}) {
  const primary = kind === 'primary';
  const iconColor = primary ? '#ffffff' : '#d49124';

  return (
    <View style={{ width }}>
      <PressableScale
        accessibilityRole="button"
        haptic={primary ? 'impact' : 'selection'}
        onPress={onPress}
        style={styles.actionButton}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.actionChrome,
            primary ? styles.primaryAction : styles.secondaryAction,
          ]}
        />
        {icon === 'wallet-plus-outline' ? (
          <View style={styles.topUpIconWrap}>
            <MaterialCommunityIcons color={iconColor} name="wallet-outline" size={32} />
            <View style={styles.topUpPlus}>
              <MaterialCommunityIcons color={iconColor} name="plus" size={14} />
            </View>
          </View>
        ) : (
          <MaterialCommunityIcons color={iconColor} name={icon} size={31} />
        )}
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.actionLabel,
            primary ? styles.primaryActionText : styles.secondaryActionText,
          ]}>
          {label}
        </Text>
      </PressableScale>
    </View>
  );
}

function TransactionIcon({ icon }: { icon: WalletTransactionIcon }) {
  if (icon === 'necklace') {
    return (
      <View style={styles.necklaceIcon}>
        <View style={styles.necklaceCord} />
        <View style={styles.necklacePendant} />
      </View>
    );
  }

  if (icon === 'gate') {
    return <MaterialCommunityIcons color="#704b18" name="gate" size={29} />;
  }

  if (icon === 'pot') {
    return <MaterialCommunityIcons color="#704226" name="pot" size={29} />;
  }

  return (
    <MaterialCommunityIcons
      color={icon === 'coffee' ? '#2d1a0f' : '#263f5d'}
      name={icon === 'coffee' ? 'coffee' : 'taxi'}
      size={28}
    />
  );
}

function TransactionList({
  onViewAll,
  title = 'Recent transactions',
  transactions,
}: {
  onViewAll?: () => void;
  title?: string;
  transactions: WalletHomeState['transactions'];
}) {
  return (
    <View style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}>
        <Text selectable numberOfLines={1} style={styles.sectionTitle}>
          {title}
        </Text>
        {onViewAll ? (
          <PressableScale
            accessibilityRole="button"
            onPress={onViewAll}
            pressScale={0.985}
            style={styles.seeAllPill}>
            <Text selectable style={styles.seeAllText}>
              See all transactions →
            </Text>
          </PressableScale>
        ) : null}
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
              <Text selectable numberOfLines={1} style={styles.transactionDate}>
                {transaction.date}
              </Text>
            </View>
            <View style={styles.transactionAmountChip}>
              <Text selectable numberOfLines={1} style={styles.transactionAmountText}>
                - {transaction.amount}
              </Text>
            </View>
            <Ionicons color="#6f87a0" name="chevron-forward" size={22} />
          </View>
          {index < transactions.length - 1 ? <View style={styles.transactionDivider} /> : null}
        </View>
      ))}
      {transactions.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          subtitle="Your QR payments will appear here once you start spending."
          title="No transactions yet"
        />
      ) : null}
    </View>
  );
}

function SavedPlaces({ savedPlaces }: { savedPlaces: WalletHomeState['savedPlaces'] }) {
  return (
    <View style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}>
        <Text selectable numberOfLines={1} style={styles.sectionTitle}>
          Saved places
        </Text>
      </View>
      {savedPlaces.map((place, index) => (
        <View key={place.name}>
          <PressableScale accessibilityRole="button" pressScale={0.985} style={styles.savedRow}>
            <View style={[styles.transactionIcon, { backgroundColor: place.tint }]}>
              <MaterialCommunityIcons color={navy} name={place.icon} size={27} />
            </View>
            <View style={styles.transactionDetails}>
              <Text selectable numberOfLines={1} style={styles.transactionMerchant}>
                {place.name}
              </Text>
              <Text selectable style={styles.transactionDate}>
                {place.detail}
              </Text>
            </View>
            <Ionicons color="#6f87a0" name="chevron-forward" size={22} />
          </PressableScale>
          {index < savedPlaces.length - 1 ? <View style={styles.transactionDivider} /> : null}
        </View>
      ))}
      {savedPlaces.length === 0 ? (
        <EmptyState
          icon="bookmark-outline"
          subtitle="Save frequent merchant QRs and they will show up here."
          title="No saved QR places"
        />
      ) : null}
    </View>
  );
}

function ProfileSummary({ profile }: { profile: WalletHomeState['profile'] }) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileAvatar}>
        <Ionicons color="#ffffff" name="person" size={28} />
      </View>
      <View style={styles.profileCopy}>
        <Text selectable style={styles.profileName}>
          {profile.name}
        </Text>
        <Text selectable style={styles.profileDetail}>
          {profile.detail}
        </Text>
      </View>
      <Ionicons color={navy} name="chevron-forward" size={23} />
    </View>
  );
}

function SecurityBanner() {
  return (
    <PressableScale accessibilityRole="button" pressScale={0.985} style={styles.securityBanner}>
      <Image resizeMode="cover" source={walletSecurityArt} style={styles.securityArt} />
      <View style={styles.securityTextWrap}>
        <Text selectable adjustsFontSizeToFit numberOfLines={1} style={styles.securityTitle}>
          Your payments are secure and private
        </Text>
        <Text selectable numberOfLines={1} style={styles.securitySubtitle}>
          We never share your data
        </Text>
      </View>
      <Ionicons color={navy} name="chevron-forward" size={23} />
    </PressableScale>
  );
}

function BottomTabs({
  activeTab,
  onScanQr,
  onTabPress,
  tabs,
}: {
  activeTab: WalletHomeTab;
  onScanQr: (() => void) | undefined;
  onTabPress: (tab: WalletHomeTab) => void;
  tabs: WalletHomeState['tabs'];
}) {
  const [barWidth, setBarWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  );

  // 5 visual slots: [tab0][tab1][FAB placeholder][tab2][tab3]
  const slotCount = tabs.length + 1;
  const slotWidth = barWidth > 0 ? barWidth / slotCount : 0;
  // tabs at index >= 2 sit one slot to the right of the FAB placeholder
  const activeSlotIndex = activeIndex < 2 ? activeIndex : activeIndex + 1;

  const activeX = useSharedValue(activeSlotIndex * slotWidth);
  const activeSurfaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value }],
    width: slotWidth,
  }));

  useEffect(() => {
    const target = activeSlotIndex * slotWidth;
    activeX.value = reduceMotion
      ? target
      : withTiming(target, {
          duration: 180,
          easing: Easing.bezier(...appMotion.easeOut.easing),
        });
  }, [activeSlotIndex, activeX, reduceMotion, slotWidth]);

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)} style={styles.tabBar}>
      {barWidth > 0 ? (
        <Animated.View style={[styles.activeTabSurface, activeSurfaceStyle]} />
      ) : null}
      {leftTabs.map((tab) => (
        <PressableScale
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.id }}
          haptic={false}
          key={tab.id}
          onPress={() => onTabPress(tab.id)}
          pressScale={0.96}
          style={styles.tabItem}>
          <Ionicons color={activeTab === tab.id ? navy : '#304e72'} name={tab.icon} size={27} />
          <Text selectable style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
          {activeTab === tab.id ? <View style={styles.activeTabIndicator} /> : null}
        </PressableScale>
      ))}
      {/* Center FAB slot — marginTop lifts the circle above the bar */}
      <View style={styles.fabSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan QR"
          onPress={onScanQr}
          style={styles.fabButton}>
          <MaterialCommunityIcons color="#ffffff" name="line-scan" size={28} />
        </Pressable>
      </View>
      {rightTabs.map((tab) => (
        <PressableScale
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.id }}
          haptic={false}
          key={tab.id}
          onPress={() => onTabPress(tab.id)}
          pressScale={0.96}
          style={styles.tabItem}>
          <Ionicons color={activeTab === tab.id ? navy : '#304e72'} name={tab.icon} size={27} />
          <Text selectable style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
          {activeTab === tab.id ? <View style={styles.activeTabIndicator} /> : null}
        </PressableScale>
      ))}
    </View>
  );
}

export function WalletHomeScreen({
  state = defaultWalletHomeState,
  onBack,
  onScanQr,
  onTopUp,
}: {
  state?: WalletHomeState;
  onBack?: () => void;
  onScanQr?: () => void;
  onTopUp?: () => void;
}) {
  const { formattedBalance } = useWallet();
  const [activeTab, setActiveTab] = useState<WalletHomeTab>('home');
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(24, Math.min(30, width * 0.06));
  const actionButtonWidth = (width - horizontalPadding * 2 - 18) / 2;
  const tabTitle = getWalletHomeTabTitle(activeTab);

  function selectTab(tab: WalletHomeTab) {
    setActiveTab(tab);
    triggerSelectionHaptic();
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Image resizeMode="cover" source={walletHomeBg} style={styles.backgroundArt} />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 8, 56),
            paddingHorizontal: horizontalPadding,
            paddingBottom: Math.max(insets.bottom + 128, 144),
          },
        ]}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}>
        <WalletNavbar onBackPress={onBack} onProfilePress={() => selectTab('profile')} />

        {tabTitle ? (
          <Text selectable style={styles.tabScreenTitle}>
            {tabTitle}
          </Text>
        ) : null}

        {activeTab === 'home' ? (
          <>
            <StaggeredSection index={0}>
              <BalanceCard balance={{ ...state.balance, npr: formattedBalance }} />
            </StaggeredSection>

            <StaggeredSection index={1}>
              <View style={styles.actionsRow}>
                <ActionButton
                  icon="line-scan"
                  kind="primary"
                  label="Scan QR"
                  onPress={onScanQr}
                  width={actionButtonWidth}
                />
                <ActionButton
                  icon="wallet-plus-outline"
                  kind="secondary"
                  label="Top up"
                  onPress={onTopUp}
                  width={actionButtonWidth}
                />
              </View>
            </StaggeredSection>

            <StaggeredSection index={2}>
              <TransactionList
                onViewAll={() => selectTab('history')}
                transactions={state.transactions}
              />
            </StaggeredSection>
            <StaggeredSection index={3}>
              <SecurityBanner />
            </StaggeredSection>
          </>
        ) : null}
        {activeTab === 'history' ? (
          <TransactionList title="All transactions" transactions={state.transactions} />
        ) : null}
        {activeTab === 'saved' ? <SavedPlaces savedPlaces={state.savedPlaces} /> : null}
        {activeTab === 'profile' ? <ProfileSummary profile={state.profile} /> : null}
      </ScrollView>
      <View style={[styles.bottomChrome, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <BottomTabs
          activeTab={activeTab}
          onScanQr={onScanQr}
          onTabPress={selectTab}
          tabs={state.tabs}
        />
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
    gap: 10,
  },
  backgroundArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  tabScreenTitle: {
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 39,
  },
  balanceCard: {
    minHeight: 160,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: appSurfaces.cardBorder,
    backgroundColor: 'rgba(255, 252, 246, 0.9)',
    overflow: 'hidden',
    boxShadow: '0 10px 26px rgba(35, 63, 91, 0.16)',
  },
  balanceArt: {
    position: 'absolute',
    right: -74,
    bottom: -12,
    width: '112%',
    height: '96%',
    opacity: 0.98,
  },
  balanceScrim: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '57%',
    backgroundColor: 'rgba(255, 252, 246, 0.9)',
  },
  balanceText: {
    zIndex: 2,
    width: '74%',
    paddingLeft: 22,
    paddingTop: 20,
  },
  balanceLabel: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
  },
  balanceAmount: {
    marginTop: 16,
    color: navy,
    fontFamily: appHeavyFontFamily,
    fontSize: 43,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 47,
  },
  usdAmount: {
    marginTop: 20,
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  balanceDash: {
    position: 'absolute',
    left: 23,
    top: 108,
    zIndex: 2,
  },
  cardShield: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  actionButton: {
    width: '100%',
    minHeight: 52,
    borderRadius: 24,
    borderCurve: 'continuous',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  actionChrome: {
    borderRadius: 24,
    borderCurve: 'continuous',
    pointerEvents: 'none',
  },
  primaryAction: {
    backgroundColor: '#003f75',
    borderWidth: 2,
    borderColor: '#082c63',
  },
  secondaryAction: {
    backgroundColor: appSurfaces.warmCard,
    borderWidth: 1.8,
    borderColor: '#dfa83a',
  },
  actionLabel: {
    fontFamily: appBoldFontFamily,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  primaryActionText: {
    color: '#ffffff',
  },
  secondaryActionText: {
    color: navy,
  },
  topUpIconWrap: {
    width: 37,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpPlus: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fffaf0',
    backgroundColor: '#fffaf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionsCard: {
    marginTop: 5,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1.4,
    borderColor: appSurfaces.cardBorder,
    backgroundColor: appSurfaces.warmCard,
    overflow: 'hidden',
    paddingHorizontal: 19,
    paddingTop: 14,
    paddingBottom: 12,
    boxShadow: appSurfaces.walletShadow,
  },
  transactionsHeader: {
    minHeight: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    flexShrink: 0,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  seeAllPill: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 12,
  },
  seeAllText: {
    color: '#0058c8',
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  transactionRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    paddingLeft: 13,
    paddingRight: 6,
    gap: 3,
  },
  transactionMerchant: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  transactionDate: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  transactionAmountChip: {
    flexShrink: 0,
    alignSelf: 'center',
    marginLeft: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  transactionAmountText: {
    color: '#C0292B',
    fontFamily: appBoldFontFamily,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  transactionDivider: {
    height: 1,
    backgroundColor: softLine,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 18,
    gap: 7,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 74, 148, 0.1)',
  },
  emptyStateTitle: {
    marginTop: 4,
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    maxWidth: 250,
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center',
  },
  savedRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 2,
    minHeight: 54,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.96)',
    backgroundColor: 'rgba(252, 255, 255, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    overflow: 'hidden',
    boxShadow: '0 9px 16px rgba(35, 63, 91, 0.13)',
  },
  securityArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -8,
    bottom: -8,
    opacity: 0.92,
  },
  securityTextWrap: {
    flex: 1,
    gap: 3,
  },
  securityTitle: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  securitySubtitle: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
  profileCard: {
    minHeight: 86,
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1.4,
    borderColor: appSurfaces.cardBorder,
    backgroundColor: appSurfaces.warmCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 18,
    boxShadow: appSurfaces.walletShadow,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b4a94',
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  profileDetail: {
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
  },
  bottomChrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    zIndex: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#003f75',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0, 30, 80, 0.45)',
  },
  tabBar: {
    minHeight: 60,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.96)',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'visible',
    boxShadow: '0 15px 31px rgba(35, 63, 91, 0.2)',
  },
  tabItem: {
    flex: 1,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 20,
    borderCurve: 'continuous',
    zIndex: 2,
  },
  activeTabSurface: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 5,
    bottom: 5,
    left: 0,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(0, 88, 200, 0.08)',
  },
  tabLabel: {
    color: '#18365e',
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  activeTabLabel: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 1,
    width: 28,
    height: 3,
    borderRadius: 8,
    backgroundColor: '#0058c8',
  },
});
