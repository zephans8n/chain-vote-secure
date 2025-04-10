
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface ConnectWalletProps {
  isMobile?: boolean;
}

const ConnectWallet = ({ isMobile = false }: ConnectWalletProps) => {
  const { address, isConnected, networkName, isLoading, connect, isMetaMaskInstalled } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (isConnected) return; // Already connected
    
    setIsConnecting(true);
    try {
      const walletAddress = await connect();
      toast({
        title: "Wallet Connected",
        description: `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      // Error already handled in the hook
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // If MetaMask is not installed
  if (!isMetaMaskInstalled) {
    return (
      <Button 
        variant="outline" 
        className="text-amber-600 border-amber-600"
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        size={isMobile ? "lg" : "default"}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Install MetaMask
      </Button>
    );
  }

  if (isMobile) {
    return (
      <Button 
        onClick={handleConnect}
        className={`w-full ${address ? "" : "btn-gradient"}`}
        variant={address ? "outline" : "default"}
        disabled={isLoading || isConnecting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading 
          ? "Loading..." 
          : isConnecting 
            ? "Connecting..." 
            : address 
              ? formatAddress(address) 
              : "Connect Wallet"
        }
      </Button>
    );
  }

  return (
    <div className="flex flex-col">
      <Button 
        onClick={handleConnect}
        className={address ? "" : "btn-gradient"}
        variant={address ? "outline" : "default"}
        disabled={isLoading || isConnecting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading 
          ? "Loading..." 
          : isConnecting 
            ? "Connecting..." 
            : address 
              ? formatAddress(address) 
              : "Connect Wallet"
        }
      </Button>
      {address && networkName && (
        <span className="text-xs text-gray-500 mt-1 text-center">{networkName}</span>
      )}
    </div>
  );
};

export default ConnectWallet;
