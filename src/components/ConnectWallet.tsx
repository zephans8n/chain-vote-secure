
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from 'lucide-react';
import { connectWallet } from '@/lib/web3';

interface ConnectWalletProps {
  isMobile?: boolean;
}

const ConnectWallet = ({ isMobile = false }: ConnectWalletProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (address) return; // Already connected
    
    setIsConnecting(true);
    try {
      const walletAddress = await connectWallet();
      setAddress(walletAddress);
      toast({
        title: "Wallet Connected",
        description: `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isMobile) {
    return (
      <Button 
        onClick={handleConnect}
        className={address ? "w-full" : "w-full btn-gradient"}
        variant={address ? "outline" : "default"}
        disabled={isConnecting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting 
          ? "Connecting..." 
          : address 
            ? formatAddress(address) 
            : "Connect Wallet"
        }
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      className={address ? "" : "btn-gradient"}
      variant={address ? "outline" : "default"}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting 
        ? "Connecting..." 
        : address 
          ? formatAddress(address)
          : "Connect Wallet"
      }
    </Button>
  );
};

export default ConnectWallet;
