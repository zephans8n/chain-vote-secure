
import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletState } from '@/lib/interfaces';

interface VotingContextType extends WalletState {
  isLoading: boolean;
  connect: () => Promise<string>;
  isMetaMaskInstalled: boolean;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export function VotingProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  
  return (
    <VotingContext.Provider value={wallet}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}
