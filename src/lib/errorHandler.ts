
import { toast } from "@/components/ui/use-toast";

/**
 * Custom error handler to manage and display web3 and contract errors
 */
export const handleWeb3Error = (error: any, operation: string): void => {
  console.error(`Error during ${operation}:`, error);
  
  // Extract the most meaningful error message
  let errorMessage = "An unknown error occurred";
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && error.reason) {
    // Extract reason from ethers error object
    errorMessage = error.reason;
  } else if (error && error.message) {
    errorMessage = error.message;
  }
  
  // Check for common MetaMask/Web3 errors
  if (errorMessage.includes("rejected") || errorMessage.includes("denied") || error?.code === 4001) {
    toast({
      title: "Transaction Rejected",
      description: "You rejected the transaction. Please try again if this was unintended.",
      variant: "default"
    });
    return;
  }
  
  if (errorMessage.includes("network") || errorMessage.includes("chain")) {
    toast({
      title: "Network Error",
      description: "Please check your network connection and make sure you're connected to the correct blockchain network.",
      variant: "destructive"
    });
    return;
  }
  
  // Generic error toast
  toast({
    title: `Error: ${operation}`,
    description: errorMessage.slice(0, 100), // Truncate very long messages
    variant: "destructive"
  });
};

/**
 * Format wallet address for display
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp: number | string): string => {
  if (!timestamp) return '';
  
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp * 1000)  // Unix timestamp (seconds)
    : new Date(timestamp);        // ISO string or JS timestamp (ms)
    
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate time left until a deadline
 */
export const getTimeLeft = (endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);
  
  if (now > end) return 'Voting ended';
  
  const diffTime = Math.abs(end.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours} hr${diffHours !== 1 ? 's' : ''} left`;
  } else if (diffHours > 0) {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours} hr${diffHours !== 1 ? 's' : ''} ${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} left`;
  } else {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} left`;
  }
};
