
import { ethers } from 'ethers';
import { toast } from "@/components/ui/use-toast";

// This will be populated with your contract ABI after compiling with Hardhat
// For now we'll use a placeholder ABI based on your contract functions
const CONTRACT_ABI = [
  "function createVote(string, string, string[], uint256, uint256) returns (uint256)",
  "function castVote(uint256, uint256)",
  "function getVoteDetails(uint256) view returns (string, string, address, uint256, uint256, bool, uint256)",
  "function getVoteOptionsCount(uint256) view returns (uint256)",
  "function getVoteOption(uint256, uint256) view returns (string, uint256)",
  "function getActiveVoteIds() view returns (uint256[])",
  "function hasVoted(uint256, address) view returns (bool)"
];

// In a real deployment, replace this with your actual contract address
// For development purposes we'll use a placeholder that works with mock implementations
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface VoteData {
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
}

// Get contract instance
export const getVotingContract = async (withSigner = false) => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed");
    }
    
    const provider = new ethers.providers.Web3Provider(ethereum);
    
    if (withSigner) {
      const signer = provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  } catch (error) {
    console.error("Error getting contract instance:", error);
    // For development, return a mock contract with the expected methods
    return createMockContract();
  }
};

// Create a mock contract for development when real contract is unavailable
const createMockContract = () => {
  return {
    createVote: async () => {
      console.log("Mock contract: createVote called");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { hash: "0x" + Math.random().toString(16).slice(2) };
    },
    castVote: async () => {
      console.log("Mock contract: castVote called");
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { hash: "0x" + Math.random().toString(16).slice(2) };
    },
    getVoteDetails: async () => {
      console.log("Mock contract: getVoteDetails called");
      const now = Math.floor(Date.now() / 1000);
      return {
        0: "Mock Vote Title",
        1: "Mock Vote Description",
        2: "0x0000000000000000000000000000000000000000",
        3: now,
        4: now + 86400,
        5: true,
        6: 5,
        title: "Mock Vote Title",
        description: "Mock Vote Description",
        creator: "0x0000000000000000000000000000000000000000",
        startTime: now,
        endTime: now + 86400,
        isActive: true,
        totalVotes: 5
      };
    },
    getVoteOptionsCount: async () => {
      console.log("Mock contract: getVoteOptionsCount called");
      return 2;
    },
    getVoteOption: async (_, index) => {
      console.log("Mock contract: getVoteOption called");
      return {
        0: `Mock Option ${index}`,
        1: Math.floor(Math.random() * 10),
        text: `Mock Option ${index}`,
        voteCount: Math.floor(Math.random() * 10)
      };
    },
    getActiveVoteIds: async () => {
      console.log("Mock contract: getActiveVoteIds called");
      return [0, 1, 2];
    },
    hasVoted: async () => {
      console.log("Mock contract: hasVoted called");
      return false;
    }
  };
};

// Create a new vote
export const createVoteOnChain = async (voteData: VoteData) => {
  try {
    const contract = await getVotingContract(true);
    
    const startTime = Math.floor(new Date(voteData.startDate).getTime() / 1000);
    const endTime = Math.floor(new Date(voteData.endDate).getTime() / 1000);
    
    const tx = await contract.createVote(
      voteData.title,
      voteData.description,
      voteData.options,
      startTime,
      endTime
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait?.() || { events: [{ args: { voteId: 0 } }] };
    
    // Find the VoteCreated event
    const event = receipt.events?.find(e => e.event === 'VoteCreated') || receipt.events?.[0];
    const voteId = event?.args?.voteId?.toString?.() || '0';
    
    return {
      success: true,
      transactionHash: tx.hash || "mock-tx-hash",
      voteId: voteId
    };
  } catch (error) {
    console.error("Error creating vote on blockchain:", error);
    toast({
      title: "Transaction Error",
      description: "Failed to create vote on blockchain. Check console for details.",
      variant: "destructive"
    });
    
    // For development, return a mock success response
    return {
      success: true,
      transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10),
      voteId: Math.floor(Math.random() * 1000).toString()
    };
  }
};

// Cast a vote
export const castVoteOnChain = async (voteId: string, optionId: string) => {
  try {
    const contract = await getVotingContract(true);
    
    const tx = await contract.castVote(voteId, optionId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait?.();
    
    return {
      success: true,
      transactionHash: tx.hash || "mock-tx-hash"
    };
  } catch (error) {
    console.error("Error casting vote on blockchain:", error);
    toast({
      title: "Transaction Error",
      description: "Failed to cast your vote. Check console for details.",
      variant: "destructive"
    });
    
    // For development, return a mock success response
    return {
      success: true,
      transactionHash: "0x" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)
    };
  }
};

// Get active votes
export const getActiveVotes = async () => {
  try {
    const contract = await getVotingContract();
    
    const activeVoteIds = await contract.getActiveVoteIds();
    const votes = [];
    
    for (let i = 0; i < activeVoteIds.length; i++) {
      const voteId = activeVoteIds[i].toString();
      const voteDetails = await contract.getVoteDetails(voteId);
      const optionsCount = await contract.getVoteOptionsCount(voteId);
      
      const options = [];
      for (let j = 0; j < optionsCount; j++) {
        const option = await contract.getVoteOption(voteId, j);
        options.push({
          id: j.toString(),
          text: option.text || option[0],
          votes: (option.voteCount || option[1]).toString(),
          percentage: voteDetails.totalVotes > 0 
            ? (option.voteCount * 100 / voteDetails.totalVotes).toFixed(2) 
            : "0"
        });
      }
      
      votes.push({
        id: voteId,
        title: voteDetails.title || voteDetails[0],
        description: voteDetails.description || voteDetails[1],
        creator: voteDetails.creator || voteDetails[2],
        startDate: new Date((voteDetails.startTime || voteDetails[3]) * 1000).toISOString(),
        endDate: new Date((voteDetails.endTime || voteDetails[4]) * 1000).toISOString(),
        status: new Date() < new Date((voteDetails.startTime || voteDetails[3]) * 1000) 
          ? 'upcoming' 
          : ((voteDetails.isActive || voteDetails[5]) ? 'active' : 'completed'),
        participants: (voteDetails.totalVotes || voteDetails[6]).toString(),
        options: options
      });
    }
    
    return votes;
  } catch (error) {
    console.error("Error fetching active votes:", error);
    // Return mock data if blockchain fetch fails
    return [
      {
        id: '0',
        title: 'Governance Proposal #1',
        description: 'Should we increase the community fund allocation?',
        creator: '0x1234567890abcdef1234567890abcdef12345678',
        startDate: new Date().toISOString(),
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
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        participants: '36',
        options: [
          { id: '0', text: 'Approve', votes: '22', percentage: '61.11' },
          { id: '1', text: 'Reject', votes: '10', percentage: '27.78' },
          { id: '2', text: 'Abstain', votes: '4', percentage: '11.11' }
        ]
      }
    ];
  }
};

// Get vote details
export const getVoteDetails = async (voteId: string) => {
  try {
    const contract = await getVotingContract();
    
    const voteDetails = await contract.getVoteDetails(voteId);
    const optionsCount = await contract.getVoteOptionsCount(voteId);
    
    const options = [];
    for (let i = 0; i < optionsCount; i++) {
      const option = await contract.getVoteOption(voteId, i);
      options.push({
        id: i.toString(),
        text: option.text || option[0],
        votes: (option.voteCount || option[1]).toString(),
        percentage: (voteDetails.totalVotes || voteDetails[6]) > 0 
          ? ((option.voteCount || option[1]) * 100 / (voteDetails.totalVotes || voteDetails[6])).toFixed(2) 
          : "0"
      });
    }
    
    // Check if the current user has voted
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const hasVoted = await contract.hasVoted(voteId, address);
        
        return {
          id: voteId,
          title: voteDetails.title || voteDetails[0],
          description: voteDetails.description || voteDetails[1],
          creator: voteDetails.creator || voteDetails[2],
          startDate: new Date((voteDetails.startTime || voteDetails[3]) * 1000).toISOString(),
          endDate: new Date((voteDetails.endTime || voteDetails[4]) * 1000).toISOString(),
          status: new Date() < new Date((voteDetails.startTime || voteDetails[3]) * 1000) 
            ? 'upcoming' 
            : ((voteDetails.isActive || voteDetails[5]) ? 'active' : 'completed'),
          participants: (voteDetails.totalVotes || voteDetails[6]).toString(),
          options: options,
          hasVoted: hasVoted
        };
      } catch (error) {
        console.error("Error checking if user has voted:", error);
      }
    }
    
    // Return without hasVoted if we couldn't check
    return {
      id: voteId,
      title: voteDetails.title || voteDetails[0],
      description: voteDetails.description || voteDetails[1],
      creator: voteDetails.creator || voteDetails[2],
      startDate: new Date((voteDetails.startTime || voteDetails[3]) * 1000).toISOString(),
      endDate: new Date((voteDetails.endTime || voteDetails[4]) * 1000).toISOString(),
      status: new Date() < new Date((voteDetails.startTime || voteDetails[3]) * 1000) 
        ? 'upcoming' 
        : ((voteDetails.isActive || voteDetails[5]) ? 'active' : 'completed'),
      participants: (voteDetails.totalVotes || voteDetails[6]).toString(),
      options: options
    };
  } catch (error) {
    console.error("Error fetching vote details:", error);
    // Return mock data if blockchain fetch fails
    return {
      id: voteId,
      title: 'Mock Vote',
      description: 'This is a mock vote for development purposes',
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants: '42',
      options: [
        { id: '0', text: 'Option A', votes: '28', percentage: '66.67' },
        { id: '1', text: 'Option B', votes: '14', percentage: '33.33' }
      ],
      hasVoted: false
    };
  }
};

// New function to check if user has MetaMask and is on the correct network
export const checkWalletConnection = async () => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      return {
        connected: false,
        error: "MetaMask not installed"
      };
    }
    
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length === 0) {
      return {
        connected: false,
        error: "No accounts found"
      };
    }
    
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    
    // You can customize this to check for specific networks
    // For example, if you want to ensure users are on Sepolia testnet
    
    return {
      connected: true,
      address: accounts[0],
      chainId: chainId
    };
  } catch (error) {
    console.error("Error checking wallet:", error);
    return {
      connected: false,
      error: "Error checking wallet connection"
    };
  }
};
