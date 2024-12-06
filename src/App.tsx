import React, { useState } from "react";
import { Header } from "./components/Header";
import { JobInput } from "./components/JobInput";
import { ResumeUpload } from "./components/ResumeUpload";
import { Results } from "./components/Results";
import { SavedJobs } from "./components/SavedJobs";
import { Tabs } from "./components/Tabs";
import { QuickAccess } from "./components/QuickAccess";
import { Card } from "./components/ui/Card";
import { useSavedJobs } from "./hooks/useSavedJobs";
import { useAuth } from "./hooks/useAuth";
import { ERROR_MESSAGES } from "./constants";
import type { MatchResult, TabId } from "./types";
import { analyzeJobMatches } from "./services/mockApi";

function App() {
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("results");
  const { user } = useAuth();
  const {
    savedJobs,
    saveJob,
    removeJob,
    isJobSaved,
    markAsApplied,
    markAsNotApplied,
    loading: savedJobsLoading,
  } = useSavedJobs();

  const handleResumeUpload = (file: File | null) => {
    setResume(file);
    setResults(null);
    setError("");
  };

  const handleJobsSubmit = async (jobUrls: string[]) => {
    if (!resume) {
      setError("Please upload your resume first");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setActiveTab("results");

    try {
      const matchResults = await analyzeJobMatches(jobUrls, resume);
      setResults(matchResults);
    } catch (error) {
      console.error("Error analyzing jobs:", error);
      setError(ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleApplied = (jobId: string) => {
    const job = savedJobs.find((j) => j.id === jobId);
    if (job?.appliedAt) {
      markAsNotApplied(jobId);
    } else {
      markAsApplied(jobId);
    }
  };

  const handleViewSavedJobs = () => {
    setActiveTab("saved");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <Card className="mb-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Find Your Perfect Job Match
              </h2>
              <p className="text-gray-600">
                Let AI analyze your resume against job listings to find the best
                matches. We'll score each position based on your skills and
                experience to help you focus on the opportunities that matter
                most.
              </p>
            </div>
          </Card>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Step 1: Upload Your Resume
              </h3>
              <ResumeUpload
                onResumeUpload={handleResumeUpload}
                currentFile={resume}
              />
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Step 2: Add Job Listings
              </h3>
              <JobInput
                onJobsSubmit={handleJobsSubmit}
                isLoading={isAnalyzing}
              />
            </section>

            {!results && !isAnalyzing && (
              <QuickAccess
                onViewSavedJobs={handleViewSavedJobs}
                savedJobsCount={savedJobs.length}
              />
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Analyzing job matches...</p>
              </div>
            )}

            {(results || savedJobs.length > 0) && !isAnalyzing && (
              <>
                <Tabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  savedJobsCount={savedJobs.length}
                />

                {activeTab === "results" && results && (
                  <Results
                    jobs={results.jobs}
                    savedJobIds={savedJobs.map((job) => job.originalJobId)}
                    onToggleSave={saveJob}
                    loading={savedJobsLoading}
                  />
                )}

                {activeTab === "saved" && (
                  <SavedJobs
                    jobs={savedJobs}
                    onRemoveJob={removeJob}
                    onToggleApplied={handleToggleApplied}
                    loading={savedJobsLoading}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
