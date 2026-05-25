import { useCallback, useEffect, useMemo, useState } from 'react';

const FALLBACK_RATE = 133.2;

export const amountOptions = [10, 25, 50, 100] as const;
export const paymentOptions = [
  { id: 'apple', title: 'Apple Pay' },
  { id: 'google', title: 'Google Pay' },
  { id: 'card', title: 'Debit or credit card' },
  { id: 'more', title: 'More payment options' },
] as const;

export type PaymentOptionId = (typeof paymentOptions)[number]['id'];

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

function useExchangeRate() {
  const [rate, setRate] = useState(FALLBACK_RATE);

  const fetchRate = useCallback(async () => {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const json = (await res.json()) as { result: string; rates: Record<string, number> };
      if (json.result === 'success' && typeof json.rates['NPR'] === 'number') {
        setRate(json.rates['NPR']);
      }
    } catch {
      // keep current rate on network error
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return { rate, refreshRate: fetchRate };
}

export function useTopUpAmount(rate: number, initialUsd = '50') {
  const [usdInput, setUsdInput] = useState(initialUsd);
  const usdAmount = Number.parseFloat(usdInput) || 0;
  const nprAmount = useMemo(() => Math.round(usdAmount * rate), [usdAmount, rate]);

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

    setUsdInput(formatUsdInput(nextNpr / rate));
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

export function useTopUpFlow() {
  const { rate, refreshRate } = useExchangeRate();
  const amount = useTopUpAmount(rate);
  const [selectedPaymentId, setSelectedPaymentId] = useState<PaymentOptionId>('apple');

  return {
    ...amount,
    canComplete: amount.nprAmount > 0,
    ctaLabel: `Add NPR ${amount.formattedNpr}`,
    paymentOptions,
    quoteLabel: `1 USD = ${rate.toFixed(2)} NPR`,
    refreshRate,
    selectedPaymentId,
    setSelectedPaymentId,
  };
}
