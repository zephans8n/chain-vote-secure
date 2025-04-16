
import { createVoteOnChain as createVoteContract, 
         castVoteOnChain as castVoteContract,
         getVoteDetails as getVoteDetailsContract,
         closeVoteOnChain as closeVoteContract,
         getActiveVotes as getActiveVotesContract } from './ethereum/votes';
import { WalletStatus } from './ethereum/types';

export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && Boolean(window.ethereum && window.ethereum.isMetaMask);
};

export const connectWallet = async (): Promise<string> => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }

    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }
    
    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

export const getCurrentNetwork = async (): Promise<string> => {
  try {
    const { ethereum } = window as any;
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0xaa36a7': 'Sepolia Testnet'
    };
    
    return networks[chainId] || `Chain ID: ${chainId}`;
  } catch (error) {
    console.error("Error getting network:", error);
    return "Unknown Network";
  }
};

export const checkWalletStatus = async (): Promise<WalletStatus> => {
  try {
    const { ethereum } = window as any;
    if (!ethereum) {
      return { connected: false };
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    return {
      connected: accounts.length > 0,
      address: accounts[0] || undefined,
      chainId: chainId
    };
  } catch (error) {
    console.error("Error checking wallet status:", error);
    return { connected: false, error: "Failed to check wallet status" };
  }
};

export const switchToCorrectNetwork = async (requiredChainId: string) => {
  try {
    const { ethereum } = window as any;
    const currentChainId = await ethereum.request({ method: 'eth_chainId' });
    
    if (currentChainId !== requiredChainId) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: requiredChainId }],
      });
    }
    return true;
  } catch (error) {
    console.error("Error switching network:", error);
    return false;
  }
};

// Re-export the contract functions with more user-friendly names
export const createVote = createVoteContract;
export const castVote = castVoteContract;
export const getVoteDetails = getVoteDetailsContract;
export const closeVote = closeVoteContract;
export const getActiveVotes = getActiveVotesContract;
