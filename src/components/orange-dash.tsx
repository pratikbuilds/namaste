import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type OrangeDashProps = {
  variant?: 'hero' | 'section' | 'compact';
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const dashSizes = {
  hero: { width: 70, height: 8 },
  section: { width: 78, height: 9 },
  compact: { width: 44, height: 5 },
} as const;

export function OrangeDash({ variant = 'hero', width, height, style }: OrangeDashProps) {
  const size = dashSizes[variant];

  return (
    <Svg
      width={width ?? size.width}
      height={height ?? size.height}
      viewBox="0 0 150 23"
      style={style}>
      <Path
        fill="#E35928"
        d="m148.8 11.6c0 5.2-21.7 10.9-73.8 10.9-53 0-73.6-5.1-73.6-10.9 0-4.7 15.4-11.2 72.5-11.2 43.3 0 74.9 3.5 74.9 11.2z"
      />
    </Svg>
  );
}
