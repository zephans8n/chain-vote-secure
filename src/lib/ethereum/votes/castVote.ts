
import { getVotingContract } from '../contract';
import { handleWeb3Error } from '../utils/errors';
import { toast } from "@/hooks/use-toast";

export const castVoteOnChain = async (voteId: string, optionId: string) => {
  try {
    const contract = await getVotingContract(true);
    const tx = await contract.castVote(voteId, optionId);
    await tx.wait();
    
    toast({
      title: "Vote Cast",
      description: "Your vote has been recorded successfully!",
    });
    
    return {
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    handleWeb3Error(error, "casting vote");
    throw error;
  }
};
