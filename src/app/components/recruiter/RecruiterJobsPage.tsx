import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, MapPin, Clock, Users, Trash2, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';
import { getMyJobs, deleteJob, toggleJobStatus, JobPost } from '../../../api/recruiterService';

const TYPE_BADGE: Record<string, string> = {
  'Full-time':  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Part-time':  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Contract':   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Remote':     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Internship': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

export function RecruiterJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch {
      // keep UI unchanged if API fails
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleJobStatus(id);
      setJobs(prev =>
        prev.map(j =>
          j.id === id
            ? { ...j, status: updated?.status ?? (j.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE') }
            : j
        )
      );
    } catch {
      setJobs(prev =>
        prev.map(j =>
          j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE' } : j
        )
      );
    }
  };

  const filtered = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Job Postings</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
            </p>
          </div>
          <button
            onClick={() => navigate('/recruiter/post-job')}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            Post New Job
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'ACTIVE', 'CLOSED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {f === 'ALL' ? `All (${jobs.length})` : f === 'ACTIVE' ? `Active (${jobs.filter(j => j.status === 'ACTIVE').length})` : `Closed (${jobs.filter(j => j.status === 'CLOSED').length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400 text-sm">Loading your jobs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {jobs.length === 0 ? 'No jobs posted yet' : `No ${filter.toLowerCase()} jobs`}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {jobs.length === 0
                ? 'Post your first job to start receiving applications.'
                : 'Try changing the filter above.'}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => navigate('/recruiter/post-job')}
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Post a Job
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {job.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{job.companyName}</p>

                    <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />{job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />{job.applicationCount ?? 0} applications
                      </span>
                      {job.salaryRange && (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {job.salaryRange}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />Deadline: {job.deadline}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {job.jobType && (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          TYPE_BADGE[job.jobType] ?? 'bg-gray-100 text-gray-600'
                        }`}>
                          {job.jobType}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {job.experienceLevel}
                        </span>
                      )}
                      {job.skills?.slice(0, 4).map(s => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                      {(job.skills?.length ?? 0) > 4 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(job.id)}
                      title={job.status === 'ACTIVE' ? 'Close posting' : 'Reopen posting'}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {job.status === 'ACTIVE'
                        ? <ToggleRight size={20} className="text-emerald-500" />
                        : <ToggleLeft size={20} />
                      }
                    </button>
                    <button
                      onClick={() => navigate('/recruiter/post-job', { state: { job } })}
                      title="Edit job"
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      title="Delete job"
                      className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
