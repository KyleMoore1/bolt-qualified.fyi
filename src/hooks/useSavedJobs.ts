import { useState, useEffect } from "react";
import {
  saveJob as saveJobToApi,
  removeJob as removeJobFromApi,
  getSavedJobs as getSavedJobsFromApi,
  updateJobAppliedStatus,
} from "../services/api";
import type { Job, SavedJob } from "../types";
import { useAuth } from "./useAuth";

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadSavedJobs() {
      if (!user) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      try {
        const jobs = await getSavedJobsFromApi(user.uid);
        setSavedJobs(jobs);
      } catch (error) {
        console.error("Error loading saved jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSavedJobs();
  }, [user]);

  const saveJob = async (job: Job) => {
    if (!user) return;

    try {
      const savedJob = await saveJobToApi(job, user.uid);
      setSavedJobs((prev) => [...prev, savedJob]);
    } catch (error) {
      console.error("Error saving job:", error);
      throw error;
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      await removeJobFromApi(jobId);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error removing job:", error);
      throw error;
    }
  };

  const markAsApplied = async (jobId: string) => {
    try {
      const result = await updateJobAppliedStatus(jobId, true);
      setSavedJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, appliedAt: result.appliedAt } : job
        )
      );
    } catch (error) {
      console.error("Error marking job as applied:", error);
      throw error;
    }
  };

  const markAsNotApplied = async (jobId: string) => {
    try {
      const result = await updateJobAppliedStatus(jobId, false);
      setSavedJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, appliedAt: result.appliedAt } : job
        )
      );
    } catch (error) {
      console.error("Error marking job as not applied:", error);
      throw error;
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some((job) => job.originalJobId === jobId);
  };

  return {
    savedJobs,
    saveJob,
    removeJob,
    markAsApplied,
    markAsNotApplied,
    isJobSaved,
    loading,
  };
}
