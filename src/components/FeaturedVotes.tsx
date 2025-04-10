
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchActiveVotes } from "@/lib/web3";
import { Vote } from "@/lib/interfaces";

// Fallback mock data in case blockchain fetch fails
const mockVotes = [
  {
    id: "1",
    title: "Community Fund Allocation",
    description: "Vote on how to distribute the community development fund for Q2 2025.",
    organization: "DAO Treasury",
    participants: 234,
    deadline: "2025-04-25",
    status: "active",
    daysLeft: 14
  },
  {
    id: "2",
    title: "Protocol Upgrade Proposal",
    description: "Vote on implementing the new security features in the next protocol version.",
    organization: "Tech Governance",
    participants: 412,
    deadline: "2025-04-20",
    status: "active",
    daysLeft: 9
  },
  {
    id: "3",
    title: "Board Member Election",
    description: "Annual election for the two open positions on the governing board.",
    organization: "DAO Management",
    participants: 189,
    deadline: "2025-05-01",
    status: "upcoming",
    daysLeft: 21
  }
];

const FeaturedVotes = () => {
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
          setVotes(mockVotes as unknown as Vote[]);
        }
      } catch (err) {
        console.error("Error loading votes:", err);
        setError("Failed to load votes from blockchain");
        setVotes(mockVotes as unknown as Vote[]);
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Votes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore active and upcoming votes from various organizations and communities.
            {isLoading ? " Loading..." : ""}
          </p>
          {error && (
            <p className="text-red-500 mt-2">
              {error} - Using mock data instead
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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

        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/votes">
              View All Votes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVotes;
