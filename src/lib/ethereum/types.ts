
export interface VoteData {
  title: string;
  description: string;
  options: string[];
  startDate: string;
  endDate: string;
}

export interface VoteDetails {
  id: string;
  title: string;
  description: string;
  creator: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  participants: string;
  options: VoteOption[];
  hasVoted?: boolean;
}

export interface VoteOption {
  id: string;
  text: string;
  votes: string;
  percentage: string;
}

export interface WalletStatus {
  connected: boolean;
  error?: string;
  address?: string;
  chainId?: string;
}
