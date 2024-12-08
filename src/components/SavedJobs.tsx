import { JobCard } from "./JobCard";
import { organizeJobsByPriority } from "../utils/jobUtils";
import type { Job } from "../types";

interface SavedJobsProps {
  jobs: Job[];
  onRemoveJob: (jobId: string) => void;
  onToggleApplied: (jobId: string) => void;
  loading?: boolean;
}

export function SavedJobs({
  jobs,
  onRemoveJob,
  onToggleApplied,
  loading,
}: SavedJobsProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading saved jobs...</p>
      </div>
    );
  }

  console.log("Jobs:", jobs);

  const jobGroups = organizeJobsByPriority(jobs);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No saved jobs yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Jobs you save will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {jobGroups.map((group) => (
        <div key={group.title}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {group.title}
          </h3>
          <div className="space-y-6 divide-y divide-gray-200">
            {group.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={true}
                isApplied={!!job.appliedAt}
                onToggleSave={() => onRemoveJob(job.id)}
                onToggleApplied={() => onToggleApplied(job.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
