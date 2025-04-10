
// This file contains utility functions for interacting with Ethereum
// In a real application, you would use a library like ethers.js or web3.js

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  const { ethereum } = window as any;
  return Boolean(ethereum && ethereum.isMetaMask);
};

// Connect to wallet and return address
export const connectWallet = async (): Promise<string> => {
  try {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    const { ethereum } = window as any;
    
    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    // Return the first account
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw new Error("Failed to connect wallet. Please try again.");
  }
};

// Get the current network
export const getCurrentNetwork = async (): Promise<string> => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed");
    }
    
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    // Map chainId to network name
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x2a': 'Kovan Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet'
    };
    
    return networks[chainId] || `Chain ID: ${chainId}`;
  } catch (error) {
    console.error("Error getting network:", error);
    throw error;
  }
};

// Get transaction receipt
export const getTransactionReceipt = async (txHash: string) => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed");
    }
    
    return await ethereum.request({
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    });
  } catch (error) {
    console.error("Error getting transaction receipt:", error);
    throw error;
  }
};

// Mock function to create a new vote
// In a real app, this would interact with a smart contract
export const createVote = async (voteData: any) => {
  // Mocking a contract interaction
  console.log("Creating vote with data:", voteData);
  
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10),
    voteId: Math.floor(Math.random() * 1000).toString()
  };
};

// Mock function to cast a vote
export const castVote = async (voteId: string, option: string) => {
  console.log(`Casting vote for option ${option} in vote ${voteId}`);
  
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
  };
};
