
import { ethers } from 'ethers';
import VotingContractABI from '../contracts/VotingContractABI.json';
import { toast } from "@/hooks/use-toast";

const CONTRACT_ADDRESS = '0x0'; // You'll need to deploy the contract and update this

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
      return new ethers.Contract(CONTRACT_ADDRESS, VotingContractABI, signer);
    }
    
    return new ethers.Contract(CONTRACT_ADDRESS, VotingContractABI, provider);
  } catch (error) {
    console.error("Error getting contract instance:", error);
    throw error;
  }
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
    const receipt = await tx.wait();
    
    // Find the VoteCreated event
    const event = receipt.events?.find(e => e.event === 'VoteCreated');
    const voteId = event?.args?.voteId.toString();
    
    return {
      success: true,
      transactionHash: tx.hash,
      voteId: voteId
    };
  } catch (error) {
    console.error("Error creating vote on blockchain:", error);
    toast({
      title: "Transaction Error",
      description: "Failed to create vote on blockchain. Check console for details.",
      variant: "destructive"
    });
    throw error;
  }
};

// Cast a vote
export const castVoteOnChain = async (voteId: string, optionId: string) => {
  try {
    const contract = await getVotingContract(true);
    
    const tx = await contract.castVote(voteId, optionId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    console.error("Error casting vote on blockchain:", error);
    toast({
      title: "Transaction Error",
      description: "Failed to cast your vote. Check console for details.",
      variant: "destructive"
    });
    throw error;
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
          text: option.text,
          votes: option.voteCount.toString(),
          percentage: voteDetails.totalVotes > 0 
            ? (option.voteCount * 100 / voteDetails.totalVotes).toFixed(2) 
            : "0"
        });
      }
      
      votes.push({
        id: voteId,
        title: voteDetails.title,
        description: voteDetails.description,
        creator: voteDetails.creator,
        startDate: new Date(voteDetails.startTime * 1000).toISOString(),
        endDate: new Date(voteDetails.endTime * 1000).toISOString(),
        status: new Date() < new Date(voteDetails.startTime * 1000) 
          ? 'upcoming' 
          : (voteDetails.isActive ? 'active' : 'completed'),
        participants: voteDetails.totalVotes.toString(),
        options: options
      });
    }
    
    return votes;
  } catch (error) {
    console.error("Error fetching active votes:", error);
    return [];
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
        text: option.text,
        votes: option.voteCount.toString(),
        percentage: voteDetails.totalVotes > 0 
          ? (option.voteCount * 100 / voteDetails.totalVotes).toFixed(2) 
          : "0"
      });
    }
    
    // Check if the current user has voted
    const { ethereum } = window as any;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const hasVoted = await contract.hasVoted(voteId, address);
      
      return {
        id: voteId,
        title: voteDetails.title,
        description: voteDetails.description,
        creator: voteDetails.creator,
        startDate: new Date(voteDetails.startTime * 1000).toISOString(),
        endDate: new Date(voteDetails.endTime * 1000).toISOString(),
        status: new Date() < new Date(voteDetails.startTime * 1000) 
          ? 'upcoming' 
          : (voteDetails.isActive ? 'active' : 'completed'),
        participants: voteDetails.totalVotes.toString(),
        options: options,
        hasVoted: hasVoted
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching vote details:", error);
    return null;
  }
};
