
// Contract ABI - Copy this from Remix IDE after compilation
export const CONTRACT_ABI = [
  "function createVote(string, string, string[], uint256, uint256) returns (uint256)",
  "function castVote(uint256, uint256)",
  "function closeVote(uint256)",
  "function getVoteDetails(uint256) view returns (string, string, address, uint256, uint256, bool, uint256)",
  "function getVoteOptionsCount(uint256) view returns (uint256)",
  "function getVoteOption(uint256, uint256) view returns (string, uint256)",
  "function getActiveVoteIds() view returns (uint256[])",
  "function hasVoted(uint256, address) view returns (bool)",
  "event VoteCreated(uint256 indexed voteId, string title, address indexed creator)",
  "event VoteCast(uint256 indexed voteId, uint256 optionId, address indexed voter)",
  "event VoteClosed(uint256 indexed voteId)"
];

// Replace this with your deployed contract address
export const CONTRACT_ADDRESS = '0x53dbc0F9Ae7A30Ecc4e118cd0cfddCe1e49D29e1';
