import { MatchResult } from "../types";

export const API_BASE_URL = "http://localhost:5000/api";

export async function saveJob(job: Job, userId: string): Promise<SavedJob> {
  const response = await fetch(`${API_BASE_URL}/jobs/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...job, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to save job");
  }

  return response.json();
}

export async function removeJob(jobId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove job");
  }
}

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const response = await fetch(`${API_BASE_URL}/jobs/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch saved jobs");
  }

  return response.json();
}

export async function updateJobAppliedStatus(
  jobId: string,
  applied: boolean
): Promise<{ id: string; appliedAt: string | null }> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applied`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ applied }),
  });

  if (!response.ok) {
    throw new Error("Failed to update job status");
  }

  return response.json();
}

export async function analyzeJobMatches(
  jobUrls: string[],
  resumeFile: File
): Promise<MatchResult> {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  jobUrls.forEach((url) => formData.append("jobUrls", url));

  const response = await fetch(`${API_BASE_URL}/jobs/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze job matches");
  }

  return response.json();
}
