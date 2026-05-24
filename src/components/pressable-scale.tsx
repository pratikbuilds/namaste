import type { PropsWithChildren } from 'react';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { triggerImpactHaptic, triggerSelectionHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

type HapticFeedback = 'impact' | 'selection' | false;

type PressableScaleProps = PropsWithChildren<
  PressableProps & {
    haptic?: HapticFeedback;
    pressScale?: number;
    style?: StyleProp<ViewStyle>;
  }
>;

export function PressableScale({
  haptic = 'selection',
  onPress,
  onPressIn,
  onPressOut,
  pressScale = 0.97,
  style,
  ...props
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress(event: GestureResponderEvent) {
    if (haptic === 'impact') {
      triggerImpactHaptic();
    }

    if (haptic === 'selection') {
      triggerSelectionHaptic();
    }

    onPress?.(event);
  }

  function handlePressIn(event: GestureResponderEvent) {
    scale.value = withTiming(pressScale, { duration: 120, easing: easeOut });
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    scale.value = withTiming(1, { duration: 150, easing: easeOut });
    onPressOut?.(event);
  }

  return (
    <AnimatedPressable
      {...props}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    />
  );
}
