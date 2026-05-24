import { useMemo, useState } from 'react';

export const exchangeRate = 133.2;
export const amountOptions = [10, 25, 50, 100] as const;

function formatNpr(amount: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}

function cleanUsdInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [rawWhole, ...rest] = cleaned.split('.');
  const whole = rawWhole ?? '';
  const decimal = rest.join('').slice(0, 2);

  return rest.length > 0 ? `${whole}.${decimal}` : whole;
}

function formatUsdInput(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');
}

export function useTopUpAmount(initialUsd = '50') {
  const [usdInput, setUsdInput] = useState(initialUsd);
  const usdAmount = Number.parseFloat(usdInput) || 0;
  const nprAmount = useMemo(() => Math.round(usdAmount * exchangeRate), [usdAmount]);

  function selectUsdPreset(amount: (typeof amountOptions)[number]) {
    setUsdInput(String(amount));
  }

  function updateUsdInput(value: string) {
    setUsdInput(cleanUsdInput(value));
  }

  function updateNprInput(value: string) {
    const numericValue = value.replace(/\D/g, '');
    const nextNpr = Number.parseInt(numericValue, 10);

    if (!numericValue || !Number.isFinite(nextNpr)) {
      setUsdInput('');
      return;
    }

    setUsdInput(formatUsdInput(nextNpr / exchangeRate));
  }

  return {
    formattedNpr: formatNpr(nprAmount),
    nprAmount,
    selectUsdPreset,
    updateNprInput,
    updateUsdInput,
    usdAmount,
    usdInput,
  };
}
