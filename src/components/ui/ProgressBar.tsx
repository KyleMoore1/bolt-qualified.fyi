import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-indigo-600 rounded-full h-2 transition-all duration-500 ease-in-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
}