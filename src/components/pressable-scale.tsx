import type { PropsWithChildren } from 'react';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { appMotion } from '@/theme/design';
import { triggerImpactHaptic, triggerSelectionHaptic } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const easeOut = Easing.bezier(...appMotion.easeOut.easing);

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
  const reduceMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress(event: GestureResponderEvent) {
    if (props.disabled) {
      return;
    }

    if (!onPress) {
      return;
    }

    if (haptic === 'impact') {
      triggerImpactHaptic();
    }

    if (haptic === 'selection') {
      triggerSelectionHaptic();
    }

    onPress?.(event);
  }

  function handlePressIn(event: GestureResponderEvent) {
    if (!reduceMotion && !props.disabled) {
      scale.value = withTiming(pressScale, { duration: appMotion.pressInMs, easing: easeOut });
    }
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    if (!reduceMotion) {
      scale.value = withTiming(1, { duration: appMotion.pressOutMs, easing: easeOut });
    }
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
