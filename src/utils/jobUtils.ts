import type { SavedJob, JobGroup } from '../types';

export function organizeJobsByPriority(jobs: SavedJob[]): JobGroup[] {
  // Sort all jobs by match score in descending order
  const sortedJobs = [...jobs].sort((a, b) => b.matchScore - a.matchScore);

  // Separate jobs into applied and not applied
  const applied = sortedJobs.filter(job => job.appliedAt);
  const notApplied = sortedJobs.filter(job => !job.appliedAt);

  const groups: JobGroup[] = [];

  if (notApplied.length > 0) {
    groups.push({
      title: 'Priority Applications',
      jobs: notApplied
    });
  }

  if (applied.length > 0) {
    groups.push({
      title: 'Applied Jobs',
      jobs: applied
    });
  }

  return groups;
}