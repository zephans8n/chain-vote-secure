
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVoteDetails, castVote } from '@/lib/web3';
import { useVoting } from '@/context/VotingContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Users, 
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

const VoteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [voteData, setVoteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const { isConnected, address } = useVoting();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadVoteDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const details = await fetchVoteDetails(id);
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
      
      // Reload vote details to show updated results
      const updatedDetails = await fetchVoteDetails(id!);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
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
            <Badge variant={isActive ? "default" : voteData.status === 'upcoming' ? "outline" : "secondary"}>
              {voteData.status.charAt(0).toUpperCase() + voteData.status.slice(1)}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">{voteData.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Creator</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center pt-0">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-mono">{`${voteData.creator.slice(0, 8)}...${voteData.creator.slice(-6)}`}</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm mb-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>Start: {formatDate(voteData.startDate)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>End: {formatDate(voteData.endDate)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Participation</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm mb-1">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{voteData.participants} participant{parseInt(voteData.participants) !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{calculateTimeLeft(voteData.endDate)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vote Options</CardTitle>
            <CardDescription>
              {hasVoted
                ? "You have already cast your vote."
                : canVote
                  ? "Select an option and submit your vote."
                  : isActive
                    ? "Connect your wallet to vote."
                    : voteData.status === 'upcoming'
                      ? "Voting hasn't started yet."
                      : "Voting has ended."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {voteData.options.length === 0 ? (
              <div className="text-center py-4">No voting options available</div>
            ) : (
              <>
                {canVote ? (
                  <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-4">
                    {voteData.options.map((option: any) => (
                      <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`} className="flex-1">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    {voteData.options.map((option: any) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{option.text}</span>
                          <span className="font-semibold">{option.percentage}%</span>
                        </div>
                        <Progress value={Number(option.percentage)} className="h-2" />
                        <div className="text-sm text-gray-500">
                          {option.votes} vote{parseInt(option.votes) !== 1 ? 's' : ''}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                )}
                
                {canVote && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleVote} 
                      disabled={!selectedOption || isVoting} 
                      className="w-full md:w-auto"
                    >
                      {isVoting ? "Casting Vote..." : "Cast Vote"}
                    </Button>
                  </div>
                )}
                
                {!isConnected && isActive && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6 flex items-start gap-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Wallet Required</h4>
                      <p className="text-sm text-yellow-700">
                        Please connect your wallet using the button in the navigation bar to cast your vote.
                      </p>
                    </div>
                  </div>
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
