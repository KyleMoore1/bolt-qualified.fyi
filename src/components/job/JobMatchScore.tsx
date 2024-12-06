import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface JobMatchScoreProps {
  score: number;
}

export function JobMatchScore({ score }: JobMatchScoreProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (score >= 60) return <CheckCircle className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold ${getMatchScoreColor(score)}`}>
        {score}%
      </span>
      {getMatchScoreIcon(score)}
    </div>
  );
}