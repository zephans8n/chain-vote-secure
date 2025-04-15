
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface VoteOptionProps {
  option: {
    id: string;
    text: string;
    votes: string;
    percentage: string;
  };
}

const VoteOption = ({ option }: VoteOptionProps) => {
  return (
    <div className="space-y-2">
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
  );
};

export default VoteOption;
