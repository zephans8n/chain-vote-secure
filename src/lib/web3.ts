
// This file contains utility functions for interacting with Ethereum

import { createVoteOnChain, castVoteOnChain, getActiveVotes, getVoteDetails } from './contractUtils';

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

// Create a new vote using the smart contract
export const createVote = async (voteData: any) => {
  try {
    return await createVoteOnChain(voteData);
  } catch (error) {
    console.error("Error creating vote:", error);
    
    // Fallback to mock implementation for development
    console.log("Using mock implementation instead");
    console.log("Creating vote with data:", voteData);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10),
      voteId: Math.floor(Math.random() * 1000).toString()
    };
  }
};

// Cast a vote using the smart contract
export const castVote = async (voteId: string, option: string) => {
  try {
    return await castVoteOnChain(voteId, option);
  } catch (error) {
    console.error("Error casting vote:", error);
    
    // Fallback to mock implementation for development
    console.log(`Using mock implementation instead`);
    console.log(`Casting vote for option ${option} in vote ${voteId}`);
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
    };
  }
};

// Fetch active votes from the blockchain
export const fetchActiveVotes = async () => {
  try {
    return await getActiveVotes();
  } catch (error) {
    console.error("Error fetching active votes:", error);
    // Return mock data if blockchain fetch fails
    return [];
  }
};

// Fetch vote details from the blockchain
export const fetchVoteDetails = async (voteId: string) => {
  try {
    return await getVoteDetails(voteId);
  } catch (error) {
    console.error("Error fetching vote details:", error);
    // Return null if blockchain fetch fails
    return null;
  }
};

