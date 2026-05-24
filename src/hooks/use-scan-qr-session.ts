import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

import { triggerSuccessHaptic } from '@/utils/haptics';

export type ScanQrResult = {
  data: string;
};

export function useScanQrSession() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const hasCameraPermission = permission?.granted ?? false;

  function handleBarcodeScanned(result: ScanQrResult) {
    if (scannedData) {
      return;
    }

    setScannedData(result.data);
    triggerSuccessHaptic();
  }

  return {
    handleBarcodeScanned,
    hasCameraPermission,
    requestPermission,
    scannedData,
    toggleTorch: () => setTorchEnabled((value) => !value),
    torchEnabled,
  };
}
