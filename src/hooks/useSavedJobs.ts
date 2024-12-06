import { useState, useEffect } from 'react';
import { 
  saveJob as saveJobToFirebase,
  removeJob as removeJobFromFirebase,
  getSavedJobs as getSavedJobsFromFirebase,
  markJobAsApplied as markJobAsAppliedInFirebase,
  markJobAsNotApplied as markJobAsNotAppliedInFirebase,
  isJobSaved as checkJobSaved
} from '../services/jobs';
import type { Job, SavedJob } from '../types';
import { useAuth } from './useAuth';

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
        const jobs = await getSavedJobsFromFirebase(user.uid);
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSavedJobs();
  }, [user]);

  const saveJob = async (job: Job) => {
    if (!user) return;

    try {
      // Check if already saved first
      const alreadySaved = await checkJobSaved(job.id, user.uid);
      if (alreadySaved) {
        return;
      }

      const savedJobId = await saveJobToFirebase(job, user.uid);
      const savedJob: SavedJob = {
        ...job,
        id: savedJobId,
        originalJobId: job.id,
        savedAt: new Date().toISOString()
      };
      
      setSavedJobs(prev => [...prev, savedJob]);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const removeJob = async (jobId: string) => {
    try {
      await removeJobFromFirebase(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error removing job:', error);
    }
  };

  const markAsApplied = async (jobId: string) => {
    try {
      await markJobAsAppliedInFirebase(jobId);
      setSavedJobs(prev => prev.map(job => 
        job.id === jobId
          ? { ...job, appliedAt: new Date().toISOString() }
          : job
      ));
    } catch (error) {
      console.error('Error marking job as applied:', error);
    }
  };

  const markAsNotApplied = async (jobId: string) => {
    try {
      await markJobAsNotAppliedInFirebase(jobId);
      setSavedJobs(prev => prev.map(job => 
        job.id === jobId
          ? { ...job, appliedAt: undefined }
          : job
      ));
    } catch (error) {
      console.error('Error marking job as not applied:', error);
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(job => job.originalJobId === jobId);
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