
// This file contains utility functions for interacting with Ethereum

import { createVoteOnChain, castVoteOnChain, getActiveVotes, getVoteDetails, checkWalletConnection } from '@/lib/contractUtils';
import { toast } from "@/components/ui/use-toast";

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && Boolean(window.ethereum && window.ethereum.isMetaMask);
};

// Connect to wallet and return address
export const connectWallet = async (): Promise<string> => {
  try {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    const { ethereum } = window;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }
    
    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please create an account in MetaMask.");
    }
    
    console.log("Wallet connected:", accounts[0]);
    
    // Return the first account
    return accounts[0];
  } catch (error: any) {
    console.error("Error connecting wallet:", error);
    
    // Handle user rejected request error
    if (error.code === 4001) {
      throw new Error("Connection rejected. Please approve the connection request.");
    }
    
    throw new Error(error.message || "Failed to connect wallet. Please try again.");
  }
};

// Get the current network
export const getCurrentNetwork = async (): Promise<string> => {
  try {
    const { ethereum } = window;
    
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
      '0x13881': 'Mumbai Testnet',
      '0xa86a': 'Avalanche Mainnet',
      '0xa869': 'Avalanche Testnet',
      '0xaa36a7': 'Sepolia Testnet'
    };
    
    return networks[chainId] || `Chain ID: ${chainId}`;
  } catch (error) {
    console.error("Error getting network:", error);
    return "Unknown Network";
  }
};

// Ensure user is connected to required network
export const switchToCorrectNetwork = async (requiredChainId: string) => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed");
    }
    
    const currentChainId = await ethereum.request({ method: 'eth_chainId' });
    
    if (currentChainId !== requiredChainId) {
      try {
        // Try to switch to the required network
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: requiredChainId }],
        });
        return true;
      } catch (switchError: any) {
        // If the network isn't added to MetaMask, we can't switch to it
        if (switchError.code === 4902) {
          toast({
            title: "Network not found",
            description: "Please add the required network to MetaMask.",
            variant: "destructive"
          });
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error switching network:", error);
    return false;
  }
};

// Create a new vote using the smart contract
export const createVote = async (voteData: any) => {
  try {
    console.log("Creating vote with data:", voteData);
    return await createVoteOnChain(voteData);
  } catch (error) {
    console.error("Error creating vote:", error);
    toast({
      title: "Error Creating Vote",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Cast a vote using the smart contract
export const castVote = async (voteId: string, option: string) => {
  try {
    console.log(`Casting vote for option ${option} in vote ${voteId}`);
    return await castVoteOnChain(voteId, option);
  } catch (error) {
    console.error("Error casting vote:", error);
    toast({
      title: "Error Casting Vote",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive"
    });
    
    throw error;
  }
};

// Fetch active votes from the blockchain
export const fetchActiveVotes = async () => {
  try {
    console.log("Fetching active votes");
    return await getActiveVotes();
  } catch (error) {
    console.error("Error fetching active votes:", error);
    // Return mock data if blockchain fetch fails
    return getMockVotes();
  }
};

// Mock votes for testing when blockchain is unavailable
const getMockVotes = () => {
  return [
    {
      id: '0',
      title: 'Governance Proposal #1',
      description: 'Should we increase the community fund allocation?',
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants: '42',
      options: [
        { id: '0', text: 'Yes', votes: '28', percentage: '66.67' },
        { id: '1', text: 'No', votes: '14', percentage: '33.33' }
      ]
    },
    {
      id: '1',
      title: 'Protocol Upgrade',
      description: 'Should we implement the proposed protocol upgrade?',
      creator: '0xabcdef1234567890abcdef1234567890abcdef12',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants: '36',
      options: [
        { id: '0', text: 'Approve', votes: '22', percentage: '61.11' },
        { id: '1', text: 'Reject', votes: '10', percentage: '27.78' },
        { id: '2', text: 'Abstain', votes: '4', percentage: '11.11' }
      ]
    },
    {
      id: '2',
      title: 'Board Member Election',
      description: 'Annual election for the two open positions on the governing board.',
      creator: '0x9876543210abcdef9876543210abcdef98765432',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      participants: '0',
      options: [
        { id: '0', text: 'Candidate A', votes: '0', percentage: '0' },
        { id: '1', text: 'Candidate B', votes: '0', percentage: '0' },
        { id: '2', text: 'Candidate C', votes: '0', percentage: '0' }
      ]
    }
  ];
};

// Fetch vote details from the blockchain
export const fetchVoteDetails = async (voteId: string) => {
  try {
    console.log(`Fetching details for vote ${voteId}`);
    return await getVoteDetails(voteId);
  } catch (error) {
    console.error("Error fetching vote details:", error);
    // Return null if blockchain fetch fails
    return null;
  }
};

// Function to check wallet connection status
export const checkWalletStatus = async () => {
  return await checkWalletConnection();
};
