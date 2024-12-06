import React from 'react';
import { Card } from './ui/Card';
import { JobActions } from './job/JobActions';
import { JobMatchScore } from './job/JobMatchScore';
import { JobSkills } from './job/JobSkills';
import { JobAnalysis } from './job/JobAnalysis';
import type { Job, SavedJob } from '../types';

interface JobCardProps {
  job: Job | SavedJob;
  isSaved: boolean;
  onToggleSave: () => void;
  onToggleApplied?: () => void;
  isApplied?: boolean;
  requiresAuth?: boolean;
}

export function JobCard({
  job,
  isSaved,
  onToggleSave,
  onToggleApplied,
  isApplied,
  requiresAuth
}: JobCardProps) {
  return (
    <Card className="group hover:bg-gray-50/50 transition-all duration-200">
      <div className="flex flex-col gap-4">
        {/* Header with title and company */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-grow">
            <h4 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h4>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-4">
            <JobMatchScore score={job.matchScore} />
            <JobActions
              isSaved={isSaved}
              isApplied={isApplied}
              onToggleSave={onToggleSave}
              onToggleApplied={onToggleApplied}
              jobUrl={job.url}
              requiresAuth={requiresAuth}
            />
          </div>
        </div>

        {/* Skills */}
        <JobSkills skills={job.keySkillMatches} />

        {/* Mobile match score */}
        <div className="sm:hidden">
          <JobMatchScore score={job.matchScore} />
        </div>

        {/* Analysis */}
        <JobAnalysis analysis={job.aiAnalysis} />

        {/* Mobile actions */}
        <div className="sm:hidden -mx-6 -mb-6 mt-2 px-6 py-3 border-t border-gray-100 bg-gray-50">
          <JobActions
            isSaved={isSaved}
            isApplied={isApplied}
            onToggleSave={onToggleSave}
            onToggleApplied={onToggleApplied}
            jobUrl={job.url}
            isMobile={true}
            requiresAuth={requiresAuth}
          />
        </div>
      </div>
    </Card>
  );
}