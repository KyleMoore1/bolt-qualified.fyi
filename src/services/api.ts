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
