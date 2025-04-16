
import { toast } from "@/hooks/use-toast";

export const handleWeb3Error = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, error);
  
  let errorMessage = error instanceof Error ? error.message : 
                     typeof error === 'string' ? error :
                     error?.reason || error?.message || "An unknown error occurred";
  
  if (errorMessage.includes("rejected") || errorMessage.includes("denied") || error?.code === 4001) {
    toast({
      title: "Transaction Rejected",
      description: "You rejected the transaction",
      variant: "default"
    });
    return;
  }
  
  toast({
    title: `Error: ${operation}`,
    description: errorMessage.slice(0, 100),
    variant: "destructive"
  });
};
