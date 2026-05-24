import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OrangeDash } from '@/components/orange-dash';
import { appBoldFontFamily, appFontFamily } from '@/theme/typography';

const navy = '#062454';
const mutedInk = '#40536d';

function ProfileButton({ onPress }: { onPress?: (() => void) | undefined }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.profileButton}>
      <Ionicons color={navy} name="person-outline" size={24} />
      <View style={styles.notificationDot} />
    </Pressable>
  );
}

function BackButton({ onPress }: { onPress?: (() => void) | undefined }) {
  if (!onPress) {
    return null;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.backButton}>
      <Ionicons color={navy} name="chevron-back" size={29} />
    </Pressable>
  );
}

export function WalletNavbar({
  onBackPress,
  onProfilePress,
}: {
  onBackPress?: (() => void) | undefined;
  onProfilePress?: (() => void) | undefined;
}) {
  return (
    <View style={styles.heroRow}>
      <BackButton onPress={onBackPress} />
      <View style={styles.heroCopy}>
        <Text selectable adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
          Namaste
        </Text>
        <OrangeDash variant="compact" style={styles.orangeDash} />
        <Text selectable style={styles.subtitle}>
          Ready to pay in Nepal
        </Text>
      </View>
      <ProfileButton onPress={onProfilePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    minHeight: 84,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 48,
    height: 48,
    marginTop: 2,
    marginLeft: -4,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.96)',
    boxShadow: '0 8px 16px rgba(7, 31, 68, 0.14)',
  },
  heroCopy: {
    flex: 1,
    paddingTop: 0,
  },
  title: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 44,
  },
  orangeDash: {
    marginTop: 2,
    marginLeft: 2,
  },
  subtitle: {
    marginTop: 7,
    color: mutedInk,
    fontFamily: appFontFamily,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
  },
  profileButton: {
    width: 56,
    height: 56,
    marginTop: 1,
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
});
