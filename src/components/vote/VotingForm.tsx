
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface VotingFormProps {
  options: Array<{ id: string; text: string }>;
  selectedOption: string | null;
  onOptionChange: (value: string) => void;
  onVoteSubmit: () => void;
  isVoting: boolean;
  isConnected: boolean;
}

const VotingForm = ({
  options,
  selectedOption,
  onOptionChange,
  onVoteSubmit,
  isVoting,
  isConnected
}: VotingFormProps) => {
  return (
    <div>
      <RadioGroup value={selectedOption || ""} onValueChange={onOptionChange} className="space-y-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem value={option.id} id={`option-${option.id}`} />
            <Label htmlFor={`option-${option.id}`} className="flex-1">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="mt-6">
        <Button 
          onClick={onVoteSubmit} 
          disabled={!selectedOption || isVoting} 
          className="w-full md:w-auto"
        >
          {isVoting ? "Casting Vote..." : "Cast Vote"}
        </Button>
      </div>

      {!isConnected && (
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
    </div>
  );
};

export default VotingForm;
