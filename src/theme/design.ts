export const appColors = {
  navy: '#062454',
  deepNavy: '#061c4a',
  ink: '#071d42',
  mutedInk: '#40536d',
  red: '#f24522',
  softLine: 'rgba(6, 36, 84, 0.11)',
} as const;

export const appSurfaces = {
  cardBorder: 'rgba(255, 255, 255, 0.98)',
  warmCard: 'rgba(255, 252, 246, 0.94)',
  walletShadow: '0 13px 25px rgba(35, 63, 91, 0.14)',
} as const;

export const appMotion = {
  easeOut: {
    duration: 140,
    easing: [0.23, 1, 0.32, 1],
  },
  pressInMs: 110,
  pressOutMs: 150,
  pressScale: 0.97,
  subtlePressScale: 0.985,
} as const;
