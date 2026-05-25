import { createContext, useContext, useState, type ReactNode } from 'react';

type WalletContextValue = {
  balanceNpr: number;
  formattedBalance: string;
  addBalance: (amount: number) => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function formatNpr(amount: number) {
  return `NPR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balanceNpr, setBalanceNpr] = useState(0);

  function addBalance(amount: number) {
    setBalanceNpr((prev) => prev + amount);
  }

  return (
    <WalletContext.Provider value={{ balanceNpr, formattedBalance: formatNpr(balanceNpr), addBalance }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
