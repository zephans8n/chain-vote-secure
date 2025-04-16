
import {
  createVoteOnChain,
  castVoteOnChain,
  getActiveVotes,
  getVoteDetails,
  closeVoteOnChain as closeVoteContract
} from './ethereum/votes';

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

export {
  createVoteOnChain,
  castVoteOnChain,
  getActiveVotes,
  getVoteDetails,
  closeVoteContract as closeVoteOnChain
};
