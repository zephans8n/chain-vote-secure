
import React from 'react';
import VoteGraph from '@/components/VoteGraph';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface VoteOption {
  id: string;
  text: string;
  votes: string;
  percentage: string;
}

interface VoteResultsProps {
  options: VoteOption[];
}

const VoteResults = ({ options }: VoteResultsProps) => {
  return (
    <>
      <VoteGraph options={options} />
      <div className="space-y-4 mt-6">
        {options.map((option) => (
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
    </>
  );
};

export default VoteResults;
