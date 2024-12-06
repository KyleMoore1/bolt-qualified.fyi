import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { validateUrls } from '../utils/validation';
import { ERROR_MESSAGES } from '../constants';

interface JobInputProps {
  onJobsSubmit: (jobs: string[]) => void;
  isLoading: boolean;
}

export function JobInput({ onJobsSubmit, isLoading }: JobInputProps) {
  const [jobList, setJobList] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const urls = jobList.split('\n').map(url => url.trim()).filter(Boolean);
    
    if (urls.length === 0) {
      setError(ERROR_MESSAGES.NO_JOBS_PROVIDED);
      return;
    }

    const validUrls = validateUrls(urls);
    if (validUrls.length !== urls.length) {
      setError(ERROR_MESSAGES.INVALID_URLS);
      return;
    }

    onJobsSubmit(validUrls);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jobs" className="block text-sm font-medium text-gray-700">
            Paste Job URLs (one per line)
          </label>
          <textarea
            id="jobs"
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/job1&#10;https://example.com/job2"
            value={jobList}
            onChange={(e) => {
              setJobList(e.target.value);
              setError('');
            }}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!jobList.trim()}
        >
          Analyze Jobs
        </Button>
      </form>
    </Card>
  );
}