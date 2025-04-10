
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '@/context/VotingContext';
import VoteCreationForm from '@/components/VoteCreationForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";

const CreateVote = () => {
  const { isConnected } = useVoting();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a vote",
        variant: "destructive",
      });
    }
  }, [isConnected, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create a Vote</h1>
          <p className="text-gray-600">
            Set up your blockchain-based vote with all necessary details and parameters.
          </p>
        </div>
        
        <VoteCreationForm />
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateVote;
