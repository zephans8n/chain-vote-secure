
import { getVotingContract } from '../contract';
import { VoteData } from '../types';
import { handleWeb3Error } from '../utils/errors';
import { toast } from "@/hooks/use-toast";

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
    
    const receipt = await tx.wait();
    const event = receipt.events?.find((e: any) => e.event === 'VoteCreated') || receipt.events?.[0];
    const voteId = event?.args?.voteId?.toString?.() || '0';
    
    toast({
      title: "Vote Created",
      description: "Your vote has been created successfully!",
    });
    
    return {
      success: true,
      transactionHash: tx.hash,
      voteId: voteId
    };
  } catch (error) {
    handleWeb3Error(error, "creating vote");
    throw error;
  }
};
