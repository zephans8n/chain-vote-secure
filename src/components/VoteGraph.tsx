
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface VoteGraphProps {
  options: {
    id: string;
    text: string;
    votes: string;
    percentage: string;
  }[];
}

const VoteGraph = ({ options }: VoteGraphProps) => {
  const data = options.map(option => ({
    name: option.text,
    votes: parseInt(option.votes),
    percentage: parseFloat(option.percentage)
  }));

  const config = {
    votes: {
      label: "Total Votes",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    }
  };

  return (
    <div className="w-full h-[300px] mt-4">
      <ChartContainer config={config}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            stroke="hsl(var(--foreground))"
          />
          <YAxis stroke="hsl(var(--foreground))" />
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                nameKey="name"
                labelFormatter={(value) => `Option: ${value}`}
              />
            )}
          />
          <Bar
            dataKey="votes"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default VoteGraph;
