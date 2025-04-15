
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, AlertTriangle, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConnectWalletProps {
  isMobile?: boolean;
}

const ConnectWallet = ({ isMobile = false }: ConnectWalletProps) => {
  const { address, isConnected, networkName, isLoading, connect, disconnect, isMetaMaskInstalled } = useWallet();
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

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
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

  // If on mobile
  if (isMobile) {
    if (address) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              {formatAddress(address)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            {networkName && <DropdownMenuItem className="text-xs text-gray-500">{networkName}</DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button 
        onClick={handleConnect}
        className="w-full btn-gradient"
        variant="default"
        disabled={isLoading || isConnecting}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading 
          ? "Loading..." 
          : isConnecting 
            ? "Connecting..." 
            : "Connect Wallet"
        }
      </Button>
    );
  }

  // Desktop version
  if (address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[180px]">
            <Wallet className="mr-2 h-4 w-4" />
            {formatAddress(address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          {networkName && <DropdownMenuItem className="text-xs text-gray-500">{networkName}</DropdownMenuItem>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      className="btn-gradient"
      variant="default"
      disabled={isLoading || isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isLoading 
        ? "Loading..." 
        : isConnecting 
          ? "Connecting..." 
          : "Connect Wallet"
      }
    </Button>
  );
};

export default ConnectWallet;
