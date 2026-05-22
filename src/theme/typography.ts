import { Platform } from 'react-native';

export const appFontFamily = Platform.select({
  android: 'sans-serif',
  default: 'AvenirNext-Medium',
  web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

export const appBoldFontFamily = Platform.select({
  android: 'sans-serif',
  default: 'AvenirNext-DemiBold',
  web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

export const appHeavyFontFamily = Platform.select({
  android: 'sans-serif',
  default: 'AvenirNext-Heavy',
  web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});
