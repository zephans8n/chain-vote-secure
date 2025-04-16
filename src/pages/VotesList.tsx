import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveVotes } from "@/lib/web3";
import { Vote } from "@/lib/interfaces";

const VotesList = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVotes = async () => {
      setIsLoading(true);
      try {
        const activeVotes = await getActiveVotes();
        if (activeVotes && activeVotes.length > 0) {
          setVotes(activeVotes);
        } else {
          setVotes([]);
          setError("No active votes found. Try creating a new vote.");
        }
      } catch (err) {
        console.error("Error loading votes:", err);
        setError("Failed to load votes from blockchain");
        setVotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVotes();
  }, []);

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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore Votes</h1>
            <p className="text-gray-600">
              Browse all active and upcoming votes across various organizations and communities.
            </p>
            {error && (
              <p className="text-amber-600 mt-2">
                {error}
              </p>
            )}
          </div>
          
          <Link to="/create">
            <Button>Create New Vote</Button>
          </Link>
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
        ) : votes.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No Votes Found</h3>
            <p className="text-gray-500 mb-6">There are currently no active votes available.</p>
            <Link to="/create">
              <Button>Create New Vote</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {votes.map((vote) => {
              const daysLeft = calculateDaysLeft(vote.endDate);
              
              return (
                <Card key={vote.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{vote.title}</CardTitle>
                      <Badge variant={vote.status === 'active' ? 'default' : 'outline'}>
                        {vote.status === 'active' ? 'Active' : 'Upcoming'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{vote.description}</CardDescription>
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
                      <Button variant="outline">
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
