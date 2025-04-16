
import { getVotingContract } from '../contract';
import { VoteDetails } from '../types';
import { handleWeb3Error } from '../utils/errors';

export const getVoteDetails = async (voteId: string): Promise<VoteDetails | null> => {
  try {
    const contract = await getVotingContract();
    const voteDetails = await contract.getVoteDetails(voteId);
    const optionsCount = await contract.getVoteOptionsCount(voteId);
    
    const options = [];
    let totalVotes = Number(voteDetails.totalVotes || voteDetails[6]);
    
    for (let i = 0; i < optionsCount; i++) {
      const option = await contract.getVoteOption(voteId, i);
      options.push({
        id: i.toString(),
        text: option.text || option[0],
        votes: (option.voteCount || option[1]).toString(),
        percentage: totalVotes > 0 
          ? ((Number(option.voteCount || option[1]) * 100) / totalVotes).toFixed(2)
          : "0"
      });
    }
    
    return {
      id: voteId,
      title: voteDetails.title || voteDetails[0],
      description: voteDetails.description || voteDetails[1],
      creator: voteDetails.creator || voteDetails[2],
      startDate: new Date((voteDetails.startTime || voteDetails[3]) * 1000).toISOString(),
      endDate: new Date((voteDetails.endTime || voteDetails[4]) * 1000).toISOString(),
      status: new Date() < new Date((voteDetails.startTime || voteDetails[3]) * 1000)
        ? 'upcoming'
        : (voteDetails.isActive || voteDetails[5]) ? 'active' : 'completed',
      participants: (voteDetails.totalVotes || voteDetails[6]).toString(),
      options: options
    };
  } catch (error) {
    handleWeb3Error(error, "fetching vote details");
    return null;
  }
};

export const getActiveVotes = async (): Promise<VoteDetails[]> => {
  try {
    const contract = await getVotingContract();
    const activeVoteIds = await contract.getActiveVoteIds();
    const votes: VoteDetails[] = [];
    
    for (const voteId of activeVoteIds) {
      const vote = await getVoteDetails(voteId.toString());
      if (vote) votes.push(vote);
    }
    
    return votes;
  } catch (error) {
    handleWeb3Error(error, "fetching active votes");
    return [];
  }
};
