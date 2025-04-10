
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in a real app, this would come from your backend or blockchain
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
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Votes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore active and upcoming votes from various organizations and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockVotes.map((vote) => (
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
                    <span>{vote.participants} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {vote.deadline}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{vote.daysLeft} days left</span>
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
          ))}
        </div>

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

