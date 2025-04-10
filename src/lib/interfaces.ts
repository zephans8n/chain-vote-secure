
// Types and interfaces for the application

export interface Vote {
  id: string;
  title: string;
  description: string;
  creator: string;
  organization?: string;
  options: VoteOption[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'upcoming' | 'completed' | 'canceled';
  participants?: number;
  totalVotes?: number;
  contractAddress?: string;
  category?: string;
  minParticipants?: number;
  quorum?: number;
  visibility: 'public' | 'private' | 'token-gated';
  tags?: string[];
}

export interface VoteOption {
  id: string;
  text: string;
  votes?: number;
  percentage?: number;
}

export interface VoteCreationData {
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
  eligibilityType: 'all' | 'tokenHolders' | 'whitelist';
  eligibilityDetails?: any;
  category: string;
  minParticipants?: number;
  quorum?: number;
  visibility: 'public' | 'private' | 'token-gated';
  tags?: string[];
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId?: string;
  networkName?: string;
}

export interface VotingTransaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  voteId?: string;
  option?: string;
  timestamp: number;
}
