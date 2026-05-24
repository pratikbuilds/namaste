import { StyleSheet, View } from 'react-native';

const navy = '#061c4a';

export function FlowBackIcon() {
  return (
    <View style={styles.backIcon}>
      <View style={styles.backStem} />
      <View style={[styles.backArm, styles.backArmTop]} />
      <View style={[styles.backArm, styles.backArmBottom]} />
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    width: 34,
    height: 28,
    justifyContent: 'center',
  },
  backStem: {
    width: 34,
    height: 4,
    borderRadius: 4,
    backgroundColor: navy,
  },
  backArm: {
    position: 'absolute',
    left: -2,
    width: 18,
    height: 4,
    borderRadius: 4,
    backgroundColor: navy,
  },
  backArmTop: {
    top: 6,
    transform: [{ rotate: '-45deg' }],
  },
  backArmBottom: {
    bottom: 6,
    transform: [{ rotate: '45deg' }],
  },
});
