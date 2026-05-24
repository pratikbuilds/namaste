import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, FadeIn, useReducedMotion } from 'react-native-reanimated';

import { appMotion } from '@/theme/design';

export function FlowScreenTransition({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      {...(reduceMotion
        ? {}
        : { entering: FadeIn.duration(170).easing(Easing.bezier(...appMotion.easeOut.easing)) })}
      style={styles.root}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
