import type { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export type WalletTransactionIcon = 'coffee' | 'taxi' | 'necklace' | 'gate' | 'pot';

export type WalletTransaction = {
  merchant: string;
  date: string;
  amount: string;
  icon: WalletTransactionIcon;
  tint: string;
};

export type SavedQrPlace = {
  name: string;
  detail: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
};

export type WalletHomeTab = 'home' | 'history' | 'saved' | 'profile';

export type WalletHomeTabItem = {
  id: WalletHomeTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export type WalletHomeState = {
  balance: {
    npr: string;
    usdEquivalent: string;
  };
  profile: {
    name: string;
    detail: string;
  };
  transactions: WalletTransaction[];
  savedPlaces: SavedQrPlace[];
  tabs: WalletHomeTabItem[];
};

export const defaultWalletHomeState: WalletHomeState = {
  balance: {
    npr: 'NPR 6,660',
    usdEquivalent: '~= USD 50.00',
  },
  profile: {
    name: 'Namaste traveler',
    detail: 'Google connected',
  },
  transactions: [
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
    {
      merchant: 'Garden of Dreams',
      date: 'May 20',
      amount: 'NPR 800',
      icon: 'gate',
      tint: '#ffefc9',
    },
    {
      merchant: 'Lalitpur Crafts',
      date: 'May 19',
      amount: 'NPR 1,450',
      icon: 'pot',
      tint: '#e8dfe7',
    },
  ],
  savedPlaces: [
    {
      name: 'Boudha Stupa Market',
      detail: 'Saved merchant QR',
      icon: 'bookmark-check-outline',
      tint: '#e2f3ff',
    },
    {
      name: 'Airport Taxi Counter',
      detail: 'Frequent payment',
      icon: 'map-marker-check-outline',
      tint: '#fff0ce',
    },
  ],
  tabs: [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'history', label: 'History', icon: 'time-outline' },
    { id: 'saved', label: 'Saved', icon: 'bookmark-outline' },
    { id: 'profile', label: 'Profile', icon: 'person-outline' },
  ],
};

export function getWalletHomeTabTitle(tab: WalletHomeTab) {
  if (tab === 'history') {
    return 'Payment history';
  }

  if (tab === 'saved') {
    return 'Saved QR';
  }

  if (tab === 'profile') {
    return 'Profile';
  }

  return undefined;
}
