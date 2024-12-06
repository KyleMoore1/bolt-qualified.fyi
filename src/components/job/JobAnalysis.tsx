import React from 'react';
import { Sparkles } from 'lucide-react';

interface JobAnalysisProps {
  analysis: string;
}

export function JobAnalysis({ analysis }: JobAnalysisProps) {
  return (
    <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-indigo-700">AI Analysis</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {analysis}
      </p>
    </div>
  );
}