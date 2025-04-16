
import { getVotingContract } from '../contract';
import { handleWeb3Error } from '../utils/errors';
import { toast } from "@/hooks/use-toast";

export const closeVoteOnChain = async (voteId: string) => {
  try {
    const contract = await getVotingContract(true);
    const tx = await contract.closeVote(voteId);
    await tx.wait();
    
    toast({
      title: "Vote Closed",
      description: "The vote has been closed successfully!",
    });
    
    return {
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    handleWeb3Error(error, "closing vote");
    throw error;
  }
};
