
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchActiveVotes } from "@/lib/web3";
import { Vote } from "@/lib/interfaces";

// Reusing the mock data from FeaturedVotes for consistency
const mockVotes = [
  {
    id: "1",
    title: "Community Fund Allocation",
    description: "Vote on how to distribute the community development fund for Q2 2025.",
    creator: "0x1234...5678",
    organization: "DAO Treasury",
    options: [
      { id: "1", text: "Invest in Infrastructure", votes: 120 },
      { id: "2", text: "Education Programs", votes: 85 },
      { id: "3", text: "Community Events", votes: 29 }
    ],
    startDate: "2025-03-25",
    endDate: "2025-04-25",
    status: "active",
    participants: 234,
    totalVotes: 234,
    visibility: "public" as const,
    category: "Finance"
  },
  {
    id: "2",
    title: "Protocol Upgrade Proposal",
    description: "Vote on implementing the new security features in the next protocol version.",
    creator: "0x8765...4321",
    organization: "Tech Governance",
    options: [
      { id: "1", text: "Implement Now", votes: 215 },
      { id: "2", text: "Delay for More Testing", votes: 197 }
    ],
    startDate: "2025-04-01",
    endDate: "2025-04-20",
    status: "active",
    participants: 412,
    totalVotes: 412,
    visibility: "public" as const,
    category: "Technology"
  },
  {
    id: "3",
    title: "Board Member Election",
    description: "Annual election for the two open positions on the governing board.",
    creator: "0x9876...1234",
    organization: "DAO Management",
    options: [
      { id: "1", text: "Candidate A", votes: 89 },
      { id: "2", text: "Candidate B", votes: 67 },
      { id: "3", text: "Candidate C", votes: 33 }
    ],
    startDate: "2025-04-10",
    endDate: "2025-05-01",
    status: "upcoming",
    participants: 189,
    totalVotes: 0,
    visibility: "private" as const,
    category: "Governance"
  }
];

const VotesList = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVotes = async () => {
      setIsLoading(true);
      try {
        const activeVotes = await fetchActiveVotes();
        if (activeVotes && activeVotes.length > 0) {
          setVotes(activeVotes);
        } else {
          // Fallback to mock data if no votes are returned
          setVotes(mockVotes as Vote[]);
        }
      } catch (err) {
        console.error("Error loading votes:", err);
        setError("Failed to load votes from blockchain");
        setVotes(mockVotes as Vote[]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVotes();
  }, []);

  // Calculate days left from deadline
  const calculateDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Explore Votes</h1>
          <p className="text-gray-600">
            Browse all active and upcoming votes across various organizations and communities.
          </p>
          {error && (
            <p className="text-red-500 mt-2">
              {error} - Showing sample votes instead
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {votes.map((vote) => {
              const daysLeft = calculateDaysLeft(vote.endDate);
              
              return (
                <Card key={vote.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{vote.title}</CardTitle>
                      <Badge variant={vote.status === 'active' ? 'default' : 'outline'} className={
                        vote.status === 'active' 
                          ? 'bg-voting-primary hover:bg-voting-primary/90'
                          : ''
                      }>
                        {vote.status === 'active' ? 'Active' : 'Upcoming'}
                      </Badge>
                    </div>
                    <CardDescription>{vote.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{vote.participants || 0} participants</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Deadline: {new Date(vote.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/votes/${vote.id}`}>
                      <Button variant="outline" className="text-voting-primary">
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default VotesList;
