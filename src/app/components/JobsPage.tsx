import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { JobDetails, JobResponseDTO, recommendJobs, getAllJobs } from '../../api/jobService';

const API_BASE = 'http://localhost:8080';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-1/3 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="flex gap-2 mt-auto">
        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
        <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-9 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
      </div>
    </div>
  );
}

function JobCard({ job }: { job: JobDetails }) {
  const jobParam = encodeURIComponent(
    JSON.stringify({ title: job.title, company: job.companyName, tags: job.extensions, description: job.description })
  );

  return (
    <div className="
      bg-white dark:bg-[#1a1d27]
      border border-gray-200 dark:border-gray-700/60
      rounded-xl p-6
      hover:shadow-md dark:hover:shadow-black/40
      transition-all duration-200
      flex flex-col h-full
    ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {job.thumbnail && (
            <img src={job.thumbnail} alt={job.companyName} className="w-12 h-12 object-cover rounded" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
              {job.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.companyName}</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">via {job.via}</p>
          </div>
        </div>
      </div>

      {/* Location visually hidden as requested */}
      {/* <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
      </div> 
      */}

      <div className="flex flex-wrap gap-2 mb-4">
        {job.extensions?.map(ext => (
          <span key={ext} className="px-3 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {ext}
          </span>
        ))}
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{job.description}</p>

      {/* Button container with horizontal scrolling */}
      <div 
        className="flex gap-2 mt-auto overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        <Link
          to={`/interview?job=${jobParam}`}
          className="shrink-0 px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5
            border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400
            hover:bg-violet-50 dark:hover:bg-violet-900/20"
        >
          Interview
        </Link>
        {job.applyOptions?.map(option => (
          <a
            key={option.title}
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {option.title}
          </a>
        ))}
      </div>
      
      {/* Hide webkit scrollbars for the horizontally scrolling buttons */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export function JobsPage() {
  const [jobs, setJobs] = useState<JobDetails[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Helper function to remove duplicate jobs based on title and company
  const getUniqueJobs = (jobsList: JobDetails[]) => {
    if (!jobsList) return [];
    const uniqueJobsMap = new Map();
    jobsList.forEach(job => {
      // Create a unique key combining title and company
      const uniqueKey = `${job.title}-${job.companyName}`.toLowerCase();
      if (!uniqueJobsMap.has(uniqueKey)) {
        uniqueJobsMap.set(uniqueKey, job);
      }
    });
    return Array.from(uniqueJobsMap.values());
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch ALL jobs
        const res = await fetch(`${API_BASE}/api/jobs/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: [], experience: '', topK: 100 })
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: JobDetails[] = await res.json();
        
        // Remove duplicates before setting state
        setJobs(getUniqueJobs(data));

        // Fetch RECOMMENDED jobs (Static request)
        const staticRequest = {
          skills: ["AWS", "Linux", "Networking", "Kubernetes", "IAM", "Azure", "Security Scanning"],
          experience: "senior",
          topK: 5
        };

        const recommendedData: JobResponseDTO[] = await recommendJobs(staticRequest);

        const recommendedJobDetails: JobDetails[] =
          recommendedData?.flatMap(response => response.jobLinks) ?? [];

        // Remove duplicates before setting state
        setRecommendedJobs(getUniqueJobs(recommendedJobDetails));

      } catch (err) {
        console.error('Failed to load jobs:', err);
        setJobs([]);
        setRecommendedJobs([]);
        setError('No jobs found.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Create a Set of recommended job keys so we don't show them again in "All Jobs"
  const recommendedJobKeys = new Set(
    recommendedJobs.map(job => `${job.title}-${job.companyName}`.toLowerCase())
  );

  const filteredJobs = jobs.filter(job => {
    const uniqueKey = `${job.title}-${job.companyName}`.toLowerCase();
    
    // 1. Prevent Cross-Duplication: If it's in Recommended, don't show in All Jobs
    if (recommendedJobKeys.has(uniqueKey)) {
      return false;
    }

    // 2. Text Search Filter
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.extensions && job.extensions.some(ext => ext.toLowerCase().includes(searchQuery.toLowerCase())));

    // 3. Dropdown Filter
    const matchesFilter =
      filterType === 'all' || (job.extensions && job.extensions.includes(filterType));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <header className="bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Board</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            aria-label="Search jobs"
          />

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded"
            aria-label="Filter jobs by type" 
            title="Filter jobs by type"
          >
            <option value="all">All</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {recommendedJobs.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-4">Recommended</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recommendedJobs.map(job => (
                <JobCard key={job.shareLink || `${job.title}-${job.companyName}`} job={job} />
              ))}
            </div>
          </>
        )}

        <h2 className="text-lg font-bold mb-4">All Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.shareLink || `${job.title}-${job.companyName}`} job={job} />
            ))
          ) : (
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          )}
        </div>

      </div>
    </div>
  );
}