import React from 'react';
import { JobCard } from './JobCard';
import { useAuth } from '../hooks/useAuth';
import type { Job } from '../types';

interface ResultsProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (job: Job) => void;
  loading?: boolean;
}

export function Results({ jobs, savedJobIds, onToggleSave, loading }: ResultsProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!user && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-indigo-700 text-sm">
            Sign in to save jobs and track your applications
          </p>
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {jobs.map((job) => {
          const isSaved = savedJobIds.some(id => id === job.id);
          return (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved}
              onToggleSave={() => onToggleSave(job)}
              requiresAuth={!user}
            />
          );
        })}
      </div>
    </div>
  );
}