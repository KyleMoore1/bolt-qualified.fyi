export interface Job {
  id: string;
  title: string;
  company: string;
  url: string;
  matchScore: number;
  keySkillMatches: string[];
  aiAnalysis: string;
  createdAt?: string;
  userId?: string | null;
  isApplied: boolean;
  appliedAt: string | null;
  isSaved: boolean;
  savedAt: string | null;
}

export interface MatchResult {
  jobs: Job[];
}

export type TabId = "results" | "saved";

export interface JobGroup {
  title: string;
  jobs: Job[];
}
