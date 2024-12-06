import React, { useState } from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

interface QuickAccessProps {
  onViewSavedJobs: () => void;
  savedJobsCount: number;
}

export function QuickAccess({ onViewSavedJobs, savedJobsCount }: QuickAccessProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full">
              <BookmarkIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-indigo-900 font-medium">
              Want to view your saved jobs?
            </p>
          </div>
          <Button
            onClick={() => setShowAuthModal(true)}
            variant="primary"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
          >
            Sign in to view saved jobs
          </Button>
        </div>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </Card>
    );
  }

  if (savedJobsCount === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full">
            <BookmarkIcon className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-indigo-900 font-medium">
            You have {savedJobsCount} saved job{savedJobsCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={onViewSavedJobs}
          variant="primary"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
        >
          View saved jobs
        </Button>
      </div>
    </Card>
  );
}