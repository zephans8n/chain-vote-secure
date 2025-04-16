
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const calculateTimeLeft = (endDateString: string): string => {
  const endDate = new Date(endDateString);
  const now = new Date();
  const difference = endDate.getTime() - now.getTime();
  
  if (difference <= 0) return "Voting ended";
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ${hours} hr${hours > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''} left`;
  return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
};
