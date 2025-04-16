
import { VoteDetails } from '../types';

export const createMockContract = () => {
  return {
    createVote: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        hash: "0x" + Math.random().toString(16).slice(2),
        wait: async () => ({
          events: [{ args: { voteId: Math.floor(Math.random() * 1000) } }]
        })
      };
    },
    castVote: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        hash: "0x" + Math.random().toString(16).slice(2),
        wait: async () => ({})
      };
    },
    closeVote: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        hash: "0x" + Math.random().toString(16).slice(2),
        wait: async () => ({})
      };
    },
    getVoteDetails: async () => {
      return ["Mock Title", "Mock Description", "0x123...", Date.now()/1000, (Date.now()/1000) + 86400, true, 42];
    },
    getVoteOptionsCount: async () => 2,
    getVoteOption: async () => ["Yes", 28],
    getActiveVoteIds: async () => [0, 1, 2],
    hasVoted: async () => Math.random() > 0.5
  };
};

export const getMockVoteDetails = (): VoteDetails => ({
  id: '0',
  title: 'Mock Vote',
  description: 'This is a mock vote for development',
  creator: '0x1234567890abcdef1234567890abcdef12345678',
  startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active',
  participants: '42',
  options: [
    { id: '0', text: 'Yes', votes: '28', percentage: '66.67' },
    { id: '1', text: 'No', votes: '14', percentage: '33.33' }
  ]
});
