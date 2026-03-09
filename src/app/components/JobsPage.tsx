import React, { useState } from 'react';
import { Link } from 'react-router';

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
  logo: string;
}

const recommendedJobs: Job[] = [
  { id: '1', title: 'Senior Frontend Developer', company: 'TechCorp Inc.',  location: 'San Francisco, CA', type: 'Full-time', salary: '$120k - $150k', description: 'We are looking for an experienced frontend developer to join our team...', tags: ['React', 'TypeScript', 'Tailwind CSS'], postedDate: '2 days ago',  logo: '🚀' },
  { id: '2', title: 'React Developer',           company: 'StartupXYZ',     location: 'Remote',            type: 'Full-time', salary: '$100k - $130k', description: 'Join our fast-growing startup as a React developer...',                 tags: ['React', 'Node.js', 'MongoDB'],        postedDate: '3 days ago',  logo: '💡' },
  { id: '3', title: 'Full Stack Engineer',        company: 'InnovateLabs',   location: 'New York, NY',      type: 'Full-time', salary: '$110k - $140k', description: 'Looking for a talented full stack engineer to build amazing products...', tags: ['JavaScript', 'Python', 'AWS'],        postedDate: '1 week ago',  logo: '🎯' },
];

const allJobs: Job[] = [
  { id: '4',  title: 'UI/UX Designer',       company: 'DesignHub',    location: 'Los Angeles, CA', type: 'Full-time', salary: '$90k - $120k',  description: 'Create stunning user interfaces and experiences for our clients...', tags: ['Figma', 'Adobe XD', 'Prototyping'],       postedDate: '4 days ago',   logo: '🎨' },
  { id: '5',  title: 'Backend Developer',    company: 'CloudSystems', location: 'Seattle, WA',     type: 'Full-time', salary: '$115k - $145k', description: 'Build scalable backend systems for our cloud platform...',            tags: ['Node.js', 'PostgreSQL', 'Docker'],        postedDate: '5 days ago',   logo: '☁️' },
  { id: '6',  title: 'DevOps Engineer',      company: 'InfraTech',    location: 'Austin, TX',      type: 'Full-time', salary: '$125k - $155k', description: 'Manage and optimize our infrastructure and deployment pipelines...',  tags: ['Kubernetes', 'AWS', 'CI/CD'],             postedDate: '1 week ago',   logo: '⚙️' },
  { id: '7',  title: 'Mobile App Developer', company: 'AppStudio',    location: 'Remote',          type: 'Contract',  salary: '$80k - $110k',  description: 'Develop cross-platform mobile applications...',                      tags: ['React Native', 'iOS', 'Android'],         postedDate: '1 week ago',   logo: '📱' },
  { id: '8',  title: 'Data Scientist',       company: 'DataWorks',    location: 'Boston, MA',      type: 'Full-time', salary: '$130k - $160k', description: 'Analyze complex data sets and build predictive models...',            tags: ['Python', 'Machine Learning', 'SQL'],      postedDate: '2 weeks ago',  logo: '📊' },
  { id: '9',  title: 'Product Manager',      company: 'ProductCo',    location: 'Chicago, IL',     type: 'Full-time', salary: '$105k - $135k', description: 'Lead product development and strategy for our platform...',          tags: ['Product Strategy', 'Agile', 'Analytics'], postedDate: '2 weeks ago',  logo: '📋' },
  { id: '10', title: 'QA Engineer',          company: 'QualityFirst', location: 'Denver, CO',      type: 'Full-time', salary: '$85k - $110k',  description: 'Ensure quality through comprehensive testing strategies...',          tags: ['Automation', 'Selenium', 'Jest'],         postedDate: '3 weeks ago',  logo: '✅' },
];

function JobCard({ job, isRecommended = false }: { job: Job; isRecommended?: boolean }) {
  return (
    <div className="
      bg-white dark:bg-[#1a1d27]
      border border-gray-200 dark:border-gray-700/60
      rounded-xl p-6
      hover:shadow-md dark:hover:shadow-black/40
      transition-all duration-200
    ">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {job.logo}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
              {job.title}
              {isRecommended && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  Recommended
                </span>
              )}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{job.company}</p>
          </div>
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
        ].map(({ icon, text }) => (
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
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map(tag => (
          <span key={tag} className="px-3 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
          Apply Now
        </button>
        <button className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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

        {/* Recommended */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map(job => <JobCard key={job.id} job={job} isRecommended />)}
          </div>
        </section>

        {/* All Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Jobs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      </div>
    </div>
  );
}