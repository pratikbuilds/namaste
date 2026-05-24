import type { TextStyle, ViewStyle } from 'react-native';

import { appHeavyFontFamily } from '@/theme/typography';

export const primaryCtaButtonStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.46)',
  borderRadius: 999,
  backgroundColor: '#052f69',
  boxShadow: '0 16px 34px rgba(0, 34, 84, 0.35)',
};

export const primaryCtaTextStyle: TextStyle = {
  color: '#ffffff',
  fontFamily: appHeavyFontFamily,
  fontSize: 21,
  fontWeight: '700',
  letterSpacing: 0,
};
