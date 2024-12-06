import React from 'react';
import type { TabId } from '../types';

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  savedJobsCount: number;
}

export function Tabs({ activeTab, onTabChange, savedJobsCount }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: 'results' as TabId, name: 'Results' },
          { id: 'saved' as TabId, name: 'Saved Jobs', count: savedJobsCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.name}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}