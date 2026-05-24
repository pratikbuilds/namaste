import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';

import { triggerSuccessHaptic } from '@/utils/haptics';

export type ScanQrResult = {
  data: string;
};

export type ScanQrPreview = {
  amount: string;
  merchant: string;
  network: string;
};

function buildScanPreview(data: string): ScanQrPreview {
  return {
    amount: 'NPR 1,250',
    merchant: data.includes('fonepay') ? 'FonePay merchant' : 'Himalayan Cafe',
    network: 'FonePay QR',
  };
}

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
    scanPreview: scannedData ? buildScanPreview(scannedData) : undefined,
    scannedData,
    toggleTorch: () => setTorchEnabled((value) => !value),
    torchEnabled,
  };
}
