import { useState } from 'react';
import { Filter } from 'lucide-react';

export interface FilterState {
  salary: string;
  jobType: string;
  location: string;
}

interface JobFilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export default function JobFilterSidebar({ filters, setFilters }: JobFilterSidebarProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filter Jobs</h2>
      </div>

      <div className="space-y-6">
        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) => handleChange('jobType', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Salary Range
          </label>
          <select
            value={filters.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Any Salary</option>
            <option value="$20k - $40k">$20k - $40k</option>
            <option value="$30k - $50k">$30k - $50k</option>
            <option value="$40k - $60k">$40k - $60k</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">All Locations</option>
            <option value="All India">All India</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Kolkata, WB">Kolkata, WB</option>
            <option value="Coastal Regions">Coastal Regions</option>
          </select>
        </div>
        
        <button 
          onClick={() => setFilters({ salary: '', jobType: '', location: '' })}
          className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
