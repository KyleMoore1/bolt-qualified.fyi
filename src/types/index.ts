export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  matchScore: number;
  keySkillMatches: string[];
  aiAnalysis: string;
}

export interface MatchResult {
  jobs: Job[];
}

export type TabId = 'results' | 'saved';

export interface SavedJob extends Job {
  savedAt: string;
  appliedAt?: string;
}

export interface JobGroup {
  title: string;
  jobs: SavedJob[];
}