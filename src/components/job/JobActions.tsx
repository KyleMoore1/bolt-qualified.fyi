import React, { useState } from 'react';
import { ExternalLink, Bookmark, BookmarkX, CheckSquare, Square } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../AuthModal';

interface JobActionsProps {
  isSaved: boolean;
  isApplied?: boolean;
  onToggleSave: () => void;
  onToggleApplied?: () => void;
  jobUrl: string;
  isMobile?: boolean;
  requiresAuth?: boolean;
}

export function JobActions({
  isSaved,
  isApplied,
  onToggleSave,
  onToggleApplied,
  jobUrl,
  isMobile = false,
  requiresAuth = false
}: JobActionsProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const buttonClassName = isMobile ? 'flex-1' : '';

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user && requiresAuth) {
      setShowAuthModal(true);
      return;
    }
    onToggleSave();
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user && requiresAuth) {
      setShowAuthModal(true);
      return;
    }
    if (onToggleApplied) {
      onToggleApplied();
    }
  };

  return (
    <>
      <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-2'} ${!isMobile ? 'sm:opacity-0 sm:group-hover:opacity-100' : ''} transition-opacity duration-200`}>
        {onToggleApplied && (
          <IconButton
            onClick={handleApplyClick}
            title={isApplied ? "Applied" : "Mark as applied"}
            variant={isApplied ? "success" : "default"}
            isActive={isApplied}
            size={isMobile ? "sm" : "md"}
            className={buttonClassName}
          >
            {isApplied ? (
              <>
                <CheckSquare className="h-4 w-4" />
                <span className="text-sm">{isMobile ? "Applied" : "Mark as applied"}</span>
              </>
            ) : (
              <>
                <Square className="h-4 w-4" />
                <span className="text-sm">{isMobile ? "Mark applied" : "Mark as applied"}</span>
              </>
            )}
          </IconButton>
        )}
        <IconButton
          onClick={handleSaveClick}
          title={isSaved ? "Remove from saved" : "Save job"}
          variant={isSaved ? "primary" : "default"}
          isActive={isSaved}
          size={isMobile ? "sm" : "md"}
          className={buttonClassName}
        >
          {isSaved ? (
            <>
              <BookmarkX className="h-4 w-4" />
              <span className="text-sm">{isMobile ? "Saved" : "Save"}</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span className="text-sm">Save</span>
            </>
          )}
        </IconButton>
        <IconButton
          as="a"
          href={jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View job posting"
          size={isMobile ? "sm" : "md"}
          className={buttonClassName}
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">View Job</span>
        </IconButton>
      </div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}