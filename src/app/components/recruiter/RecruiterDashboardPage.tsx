import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Briefcase, Users, TrendingUp, Clock, Plus } from 'lucide-react';
import { getMyJobs, JobPost } from '../../../api/recruiterService';

function StatCard({
  label, value, sub, icon, iconBg,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; iconBg: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{sub}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      {label && <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-medium" style={{ color: p.fill }}>
          Applications: {p.value}
        </p>
      ))}
    </div>
  );
}

export function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount ?? 0), 0);

  const chartData = [...jobs]
    .sort((a, b) => (b.applicationCount ?? 0) - (a.applicationCount ?? 0))
    .slice(0, 6)
    .map(j => ({
      name: j.title.length > 18 ? j.title.slice(0, 18) + '…' : j.title,
      apps: j.applicationCount ?? 0,
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name?.split(' ')[0] ?? 'Recruiter'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Here's an overview of your job postings and activity
            </p>
          </div>
          <button
            onClick={() => navigate('/recruiter/post-job')}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            Post a Job
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Jobs Posted" value={jobs.length} sub="all time"
            icon={<Briefcase size={16} className="text-white" />} iconBg="bg-slate-600"
          />
          <StatCard
            label="Active Jobs" value={activeJobs} sub="currently open"
            icon={<TrendingUp size={16} className="text-white" />} iconBg="bg-emerald-600"
          />
          <StatCard
            label="Total Applications" value={totalApps} sub="across all postings"
            icon={<Users size={16} className="text-white" />} iconBg="bg-violet-600"
          />
          <StatCard
            label="Closed Jobs" value={jobs.length - activeJobs} sub="no longer accepting"
            icon={<Clock size={16} className="text-white" />} iconBg="bg-gray-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-12 text-center shadow-sm">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">No jobs posted yet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Start by posting your first job to attract candidates.
            </p>
            <button
              onClick={() => navigate('/recruiter/post-job')}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                Applications per Job
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="apps" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">
                Recent Postings
              </h3>
              <div className="space-y-3">
                {jobs.slice(0, 6).map(job => (
                  <div key={job.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{job.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">
                        {job.applicationCount ?? 0} apps
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
