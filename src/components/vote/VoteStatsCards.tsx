
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { User, Calendar, Users, Clock } from 'lucide-react';

interface VoteStatsCardsProps {
  creator: string;
  startDate: string;
  endDate: string;
  participants: string;
  timeLeft: string;
}

const VoteStatsCards = ({ creator, startDate, endDate, participants, timeLeft }: VoteStatsCardsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Creator</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center pt-0">
          <User className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-mono">{`${creator.slice(0, 8)}...${creator.slice(-6)}`}</span>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm mb-1">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>Start: {formatDate(startDate)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>End: {formatDate(endDate)}</span>
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
            <span>{participants} participant{parseInt(participants) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{timeLeft}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoteStatsCards;
