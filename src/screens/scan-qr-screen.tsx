import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { GlassView } from 'expo-glass-effect';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/pressable-scale';
import { useScanQrSession } from '@/hooks/use-scan-qr-session';
import { appBoldFontFamily, appFontFamily } from '@/theme/typography';
import { triggerImpactHaptic, triggerSelectionHaptic } from '@/utils/haptics';

const navy = '#071f49';

function CameraPermissionPrompt({ requestPermission }: { requestPermission: () => void }) {
  return (
    <Animated.View
      entering={FadeIn.duration(180).easing(Easing.out(Easing.cubic))}
      style={styles.permissionPrompt}>
      <View style={styles.permissionIcon}>
        <Ionicons color="#ffffff" name="camera-outline" size={38} />
      </View>
      <Text selectable style={styles.permissionTitle}>
        Camera access is needed to scan QR codes
      </Text>
      <PressableScale
        accessibilityRole="button"
        haptic={false}
        onPress={() => {
          triggerImpactHaptic();
          requestPermission();
        }}
        style={styles.permissionButton}>
        <Text selectable style={styles.permissionButtonText}>
          Enable camera
        </Text>
      </PressableScale>
    </Animated.View>
  );
}

function CircleButton({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <PressableScale accessibilityRole="button" haptic={false} onPress={onPress}>
      <GlassView colorScheme="dark" glassEffectStyle="regular" style={styles.circleButton}>
        {children}
      </GlassView>
    </PressableScale>
  );
}

function TorchButton({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" haptic={false} onPress={onPress}>
      <GlassView colorScheme="dark" glassEffectStyle="regular" style={styles.torchButton}>
        <MaterialCommunityIcons color="#ffffff" name="flashlight" size={22} />
        <Text selectable style={styles.torchLabel}>
          Torch
        </Text>
      </GlassView>
    </PressableScale>
  );
}

function ScannerFrame({ active, size }: { active: boolean; size: number }) {
  const arc = Math.round(size * 0.14);
  const circle = arc * 2;
  const reduceMotion = useReducedMotion();
  const scanProgress = useSharedValue(0.18);

  useEffect(() => {
    if (!active || reduceMotion) {
      scanProgress.value = 0.5;
      return;
    }

    scanProgress.value = withRepeat(
      withTiming(0.82, { duration: 1600, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true
    );
  }, [active, reduceMotion, scanProgress]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanProgress.value * size }],
  }));

  return (
    <View style={[styles.scannerFrame, { width: size, height: size }]}>
      <View style={[styles.arcClip, styles.topLeft, { width: arc, height: arc }]}>
        <View style={[styles.arcCircle, { width: circle, height: circle, borderRadius: circle }]} />
      </View>
      <View style={[styles.arcClip, styles.topRight, { width: arc, height: arc }]}>
        <View
          style={[
            styles.arcCircle,
            { width: circle, height: circle, borderRadius: circle, right: 0 },
          ]}
        />
      </View>
      <View style={[styles.arcClip, styles.bottomLeft, { width: arc, height: arc }]}>
        <View
          style={[
            styles.arcCircle,
            { width: circle, height: circle, borderRadius: circle, bottom: 0 },
          ]}
        />
      </View>
      <View style={[styles.arcClip, styles.bottomRight, { width: arc, height: arc }]}>
        <View
          style={[
            styles.arcCircle,
            { width: circle, height: circle, borderRadius: circle, right: 0, bottom: 0 },
          ]}
        />
      </View>
      <Animated.View style={[styles.scanLine, scanLineStyle]} />
    </View>
  );
}

function GalleryButton({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" haptic={false} onPress={onPress}>
      <GlassView colorScheme="dark" glassEffectStyle="regular" style={styles.galleryButton}>
        <Ionicons color="#ffffff" name="image-outline" size={28} />
        <Text selectable style={styles.galleryLabel}>
          Gallery
        </Text>
      </GlassView>
    </PressableScale>
  );
}

export function ScanQrScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scanSession = useScanQrSession();
  const frameSize = Math.min(width - 96, height * 0.33, 292);
  const scannerTop = Math.max(insets.top + 190, height * 0.31);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {scanSession.hasCameraPermission ? (
        <CameraView
          active
          autofocus="off"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          enableTorch={scanSession.torchEnabled}
          facing="back"
          mode="picture"
          onBarcodeScanned={scanSession.handleBarcodeScanned}
          style={styles.cameraPreview}
        />
      ) : null}
      <View pointerEvents="none" style={styles.cameraScrim} />

      <View style={[styles.header, { paddingTop: insets.top + 58 }]}>
        <CircleButton
          onPress={() => {
            triggerSelectionHaptic();
            router.back();
          }}>
          <Ionicons color="#ffffff" name="arrow-back" size={32} />
        </CircleButton>
        <View style={styles.titleBlock}>
          <Text selectable style={styles.title}>
            Scan QR
          </Text>
          <Text selectable style={styles.subtitle}>
            Point your camera at a FonePay QR
          </Text>
        </View>
        <TorchButton
          onPress={() => {
            triggerImpactHaptic();
            scanSession.toggleTorch();
          }}
        />
      </View>

      {scanSession.hasCameraPermission ? (
        <>
          <View style={[styles.scanArea, { top: scannerTop }]}>
            <ScannerFrame active={scanSession.hasCameraPermission} size={frameSize} />
          </View>

          <View style={[styles.bottomContent, { paddingBottom: Math.max(insets.bottom + 34, 48) }]}>
            <GalleryButton onPress={triggerSelectionHaptic} />
            {scanSession.scannedData ? (
              <GlassView colorScheme="dark" glassEffectStyle="regular" style={styles.detectedPill}>
                <Ionicons color="#bfe4ff" name="checkmark-circle" size={18} />
                <Text selectable numberOfLines={1} style={styles.detectedText}>
                  QR detected
                </Text>
              </GlassView>
            ) : null}
          </View>
        </>
      ) : (
        <CameraPermissionPrompt
          requestPermission={() => {
            void scanSession.requestPermission();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#030303',
    overflow: 'hidden',
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  permissionPrompt: {
    position: 'absolute',
    left: 34,
    right: 34,
    top: '36%',
    zIndex: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 18,
  },
  permissionIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionTitle: {
    color: '#ffffff',
    fontFamily: appFontFamily,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'center',
  },
  permissionButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: navy,
    fontFamily: appBoldFontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
  cameraScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  titleBlock: {
    position: 'absolute',
    left: 78,
    right: 78,
    top: 8,
    alignItems: 'center',
    gap: 14,
  },
  title: {
    color: '#ffffff',
    fontFamily: appBoldFontFamily,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontFamily: appFontFamily,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
    textAlign: 'center',
  },
  torchButton: {
    minWidth: 106,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  torchLabel: {
    color: '#ffffff',
    fontFamily: appFontFamily,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  scanArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scannerFrame: {
    borderWidth: 0,
  },
  arcClip: {
    position: 'absolute',
    overflow: 'hidden',
  },
  arcCircle: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#d9e9ff',
    backgroundColor: 'transparent',
    boxShadow: '0 0 9px rgba(107, 175, 255, 0.9)',
  },
  topLeft: {
    left: 0,
    top: 0,
  },
  topRight: {
    right: 0,
    top: 0,
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
  },
  scanLine: {
    position: 'absolute',
    left: -35,
    right: -35,
    top: 0,
    height: 2,
    backgroundColor: 'rgba(154, 232, 255, 0.94)',
    boxShadow: '0 0 16px rgba(110, 217, 255, 0.95)',
  },
  bottomContent: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 0,
    alignItems: 'center',
    gap: 16,
  },
  galleryButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(0,0,0,0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  galleryLabel: {
    color: '#ffffff',
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
  detectedPill: {
    height: 38,
    maxWidth: 180,
    borderRadius: 19,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(0,0,0,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  detectedText: {
    color: '#ffffff',
    fontFamily: appFontFamily,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0,
  },
});
