import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVoteDetails, castVote, closeVote } from '@/lib/web3';
import { useVoting } from '@/context/VotingContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VoteLoadingSkeleton from '@/components/vote/VoteLoadingSkeleton';
import VoteStatsCards from '@/components/vote/VoteStatsCards';
import VotingForm from '@/components/vote/VotingForm';
import VoteResults from '@/components/vote/VoteResults';

const VoteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [voteData, setVoteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const { isConnected, address } = useVoting();
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateTimeLeft = (endDateString: string) => {
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

  const handleCloseVote = async () => {
    if (!isConnected || !id) return;
    
    try {
      await closeVote(id);
      const updatedDetails = await getVoteDetails(id);
      setVoteData(updatedDetails);
      
      toast({
        title: "Success",
        description: "Vote has been closed successfully",
      });
    } catch (error) {
      console.error("Error closing vote:", error);
      toast({
        title: "Error",
        description: "Failed to close vote",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadVoteDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const details = await getVoteDetails(id);
        if (details) {
          setVoteData(details);
        } else {
          toast({
            title: "Error",
            description: "Failed to load vote details",
            variant: "destructive"
          });
          navigate("/votes");
        }
      } catch (error) {
        console.error("Error loading vote details:", error);
        toast({
          title: "Error",
          description: "Failed to load vote details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadVoteDetails();
  }, [id, navigate, toast]);

  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to vote",
        variant: "destructive"
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "No Option Selected",
        description: "Please select an option to vote",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    try {
      await castVote(id!, selectedOption);
      
      const updatedDetails = await getVoteDetails(id!);
      setVoteData(updatedDetails);
      
      toast({
        title: "Vote Cast",
        description: "Your vote has been recorded successfully!",
      });
    } catch (error) {
      console.error("Error casting vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <VoteLoadingSkeleton />
        <Footer />
      </div>
    );
  }

  if (!voteData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle>Vote Not Found</CardTitle>
              <CardDescription>
                The requested vote details could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/votes")}>
                Back to Votes
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isActive = voteData.status === 'active';
  const hasVoted = voteData.hasVoted;
  const canVote = isConnected && isActive && !hasVoted;
  const timeLeft = calculateTimeLeft(voteData.endDate);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate("/votes")}
        >
          ← Back to Votes
        </Button>

        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-bold">{voteData.title}</h1>
            <div className="flex gap-2">
              {isConnected && voteData?.creator === address && voteData?.isActive && (
                <Button 
                  variant="destructive" 
                  onClick={handleCloseVote}
                >
                  Close Vote
                </Button>
              )}
              <Badge variant={isActive ? "default" : voteData.status === 'upcoming' ? "outline" : "secondary"}>
                {voteData.status.charAt(0).toUpperCase() + voteData.status.slice(1)}
              </Badge>
            </div>
          </div>
          <p className="text-gray-600 mt-2">{voteData.description}</p>
        </div>

        <VoteStatsCards
          creator={voteData.creator}
          startDate={voteData.startDate}
          endDate={voteData.endDate}
          participants={voteData.participants}
          timeLeft={timeLeft}
        />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vote Results</CardTitle>
            <CardDescription>
              {hasVoted
                ? "Current voting results"
                : canVote
                  ? "Select an option and submit your vote"
                  : isActive
                    ? "Connect your wallet to vote"
                    : voteData.status === 'upcoming'
                      ? "Voting hasn't started yet"
                      : "Final voting results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {voteData.options.length === 0 ? (
              <div className="text-center py-4">No voting options available</div>
            ) : (
              <>
                {canVote ? (
                  <VotingForm
                    options={voteData.options}
                    selectedOption={selectedOption}
                    onOptionChange={setSelectedOption}
                    onVoteSubmit={handleVote}
                    isVoting={isVoting}
                    isConnected={isConnected}
                  />
                ) : (
                  <VoteResults options={voteData.options} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VoteDetails;
