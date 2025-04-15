
import { useState, useEffect } from 'react';
import { connectWallet, getCurrentNetwork, isMetaMaskInstalled, checkWalletStatus } from '@/lib/web3';
import { useToast } from "@/components/ui/use-toast";
import { WalletState } from '@/lib/interfaces';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: undefined,
    networkName: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const status = await checkWalletStatus();
        
        if (status.connected && status.address) {
          const networkName = await getCurrentNetwork();
          setWalletState({
            address: status.address,
            isConnected: true,
            chainId: status.chainId,
            networkName,
          });
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMetaMaskInstalled()) {
      checkConnection();
      
      // Set up listeners for account and network changes
      const { ethereum } = window as any;
      
      if (ethereum) {
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected wallet
            setWalletState({
              address: null,
              isConnected: false,
              chainId: undefined,
              networkName: undefined,
            });
            toast({
              title: "Wallet Disconnected",
              description: "Your wallet has been disconnected",
            });
          } else {
            // Account changed
            setWalletState(prev => ({
              ...prev,
              address: accounts[0],
              isConnected: true,
            }));
            toast({
              title: "Account Changed",
              description: `Connected to: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
            });
          }
        };
        
        const handleChainChanged = async (chainId: string) => {
          const networkName = await getCurrentNetwork();
          setWalletState(prev => ({
            ...prev,
            chainId,
            networkName,
          }));
          toast({
            title: "Network Changed",
            description: `Connected to: ${networkName}`,
          });
          // Reload the page to refresh the app state with the new network
          window.location.reload();
        };
        
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleChainChanged);
        
        // Cleanup listeners on unmount
        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
          }
        };
      }
    } else {
      setIsLoading(false);
    }
  }, [toast]);

  // Connect wallet function
  const connect = async () => {
    try {
      setIsLoading(true);
      const address = await connectWallet();
      const networkName = await getCurrentNetwork();
      const { ethereum } = window as any;
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      
      setWalletState({
        address,
        isConnected: true,
        chainId,
        networkName,
      });
      
      toast({
        title: "Wallet Connected",
        description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      
      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet function
  const disconnect = async () => {
    try {
      setIsLoading(true);
      
      // MetaMask doesn't have a disconnect method, so we'll just clear the state
      setWalletState({
        address: null,
        isConnected: false,
        chainId: undefined,
        networkName: undefined,
      });
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
      
      // Force page reload to reset any cached states
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...walletState,
    isLoading,
    connect,
    disconnect,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
}
