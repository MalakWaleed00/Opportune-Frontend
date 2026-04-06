import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const API_BASE = 'http://localhost:8080';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  postedDate: string;
  recommended?: boolean;
}

interface JobDetails {
  jobTitle: string;
  contributingSkills: string[];
  jobLinks: {
    title: string;
    companyName: string;
    location: string;
    via: string;
    shareLink: string;
    thumbnail: string;
    extensions: string[];
    description: string;
    applyOptions: { title: string; link: string }[];
  }[];
}

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

function JobCard({ job, onDetails }: { job: Job; onDetails: (jobId: string) => void }) {
  const jobParam = encodeURIComponent(
    JSON.stringify({ id: job.id, title: job.title, company: job.company, tags: job.tags, description: job.description })
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
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
            {job.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.company}</p>
        </div>
        <button
          className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mt-1"
          aria-label="Save job"
          title="Save job"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-500 dark:text-gray-400">
        {[
          { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", text: job.location },
          { icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: job.type },
          { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: job.salary },
          { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: job.postedDate },
        ].filter(item => item.text).map(({ icon, text }) => (
          <span key={text} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            {text}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
        {job.tags?.map(tag => (
          <span key={tag} className="px-3 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/interview?job=${jobParam}`}
          className="px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 flex items-center gap-1.5
            border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-400
            hover:bg-violet-50 dark:hover:bg-violet-900/20"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Interview
        </Link>
        <button 
          onClick={() => onDetails(job.id)}
          className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedJobDetails, setSelectedJobDetails] = useState<JobDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchJobDetails = async (jobId: string) => {
    try {
      setDetailsLoading(true);
      const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: JobDetails = await res.json();
      setSelectedJobDetails(data);
      setIsDetailsOpen(true);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      alert('Failed to load job details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/jobs`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data: Job[] = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setJobs([]);
        setError('No jobs found.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const recommendedJobs = jobs.filter(job => job.recommended);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Board</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors
                bg-white dark:bg-[#1a1d27]
                border border-gray-200 dark:border-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-black dark:focus:border-gray-500"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            aria-label="Filter jobs by type"
            title="Filter jobs by type"
            className="px-4 py-2.5 rounded-lg text-sm outline-none transition-colors
              bg-white dark:bg-[#1a1d27]
              border border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-white
              focus:border-black dark:focus:border-gray-500"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-auto underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Recommended */}
        {(loading || recommendedJobs.length > 0) && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                : recommendedJobs.map(job => <JobCard key={job.id} job={job} onDetails={fetchJobDetails} />)
              }
            </div>
          </section>
        )}

        {/* All Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Jobs</h2>
            {!loading && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredJobs.map(job => <JobCard key={job.id} job={job} onDetails={fetchJobDetails} />)
            }
          </div>
          {!loading && filteredJobs.length === 0 && !error && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No jobs found matching your search.</p>
            </div>
          )}
        </section>
      </div>

      {/* Job Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : selectedJobDetails ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedJobDetails.jobTitle}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJobDetails.contributingSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {selectedJobDetails.jobLinks.map((jobLink, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {jobLink.thumbnail && (
                      <img src={jobLink.thumbnail} alt={jobLink.title} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{jobLink.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{jobLink.companyName} • {jobLink.location}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">via {jobLink.via}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {jobLink.extensions.map(ext => (
                      <span key={ext} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm">
                        {ext}
                      </span>
                    ))}
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{jobLink.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Apply Options</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobLink.applyOptions.map(option => (
                        <a
                          key={option.title}
                          href={option.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          {option.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}