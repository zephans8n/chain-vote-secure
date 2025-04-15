
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, AlertTriangle, LogOut, ChevronDown } from 'lucide-react';
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
      await connect();
    } catch (error) {
      // Error already handled in the hook
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
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
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              <span>Address</span>
              <span className="text-xs font-mono">{formatAddress(address)}</span>
            </DropdownMenuItem>
            {networkName && (
              <DropdownMenuItem className="flex justify-between">
                <span>Network</span>
                <span className="text-xs">{networkName}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 cursor-pointer">
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
        className="w-full bg-blue-600 hover:bg-blue-700"
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
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between">
            <span>Address</span>
            <span className="text-xs font-mono">{formatAddress(address)}</span>
          </DropdownMenuItem>
          {networkName && (
            <DropdownMenuItem className="flex justify-between">
              <span>Network</span>
              <span className="text-xs">{networkName}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 cursor-pointer">
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
      className="bg-blue-600 hover:bg-blue-700"
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
