import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getMyAnalytics, FROM_BACKEND } from '../../api/applicationService';
import type { AppStatus, AnalyticsResponse } from '../../api/applicationService';

const STATUS_FILL: Record<AppStatus, string> = {
  'Applied':             '#1d4ed8',
  'Interview Scheduled': '#7c3aed',
  'Interview Done':      '#4338ca',
  'Offer Received':      '#b45309',
  'Offer Accepted':      '#0f766e',
  'Rejected':            '#b91c1c',
  'Withdrawn':           '#334155',
};

const STATUS_BADGE: Record<AppStatus, string> = {
  'Applied':             'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Interview Scheduled': 'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Interview Done':      'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Offer Received':      'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Offer Accepted':      'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Rejected':            'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
  'Withdrawn':           'bg-slate-100 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200',
};

const STATUS_DOT: Record<AppStatus, string> = {
  'Applied':             'bg-blue-500',
  'Interview Scheduled': 'bg-violet-500',
  'Interview Done':      'bg-indigo-500',
  'Offer Received':      'bg-amber-500',
  'Offer Accepted':      'bg-emerald-500',
  'Rejected':            'bg-rose-500',
  'Withdrawn':           'bg-slate-500',
};

const FUNNEL_COLORS = ['bg-slate-600', 'bg-slate-500', 'bg-slate-400', 'bg-slate-300'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      {label && <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-medium" style={{ color: p.color ?? p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{sub}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function AnalyticsDashboardpage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getMyAnalytics()
      .then(setAnalytics)
      .catch(() => setError("Could not load analytics. Make sure the backend is running and you are logged in."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading analytics…</p>
    </div>
  );

  if (error || !analytics) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-red-500 text-sm text-center">{error ?? "Failed to load analytics."}</p>
      <button onClick={load} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:opacity-80 transition-opacity">
        Retry
      </button>
    </div>
  );

  const { total, interviews, offers, accepted, rejected, interviewRate, offerRate, successRate, statusBreakdown, recentApplications } = analytics;
  const acceptedRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const statusData = Object.entries(statusBreakdown)
    .map(([k, v]) => ({ name: FROM_BACKEND[k] ?? k, value: v }))
    .filter(d => d.value > 0);

  const funnelSteps = [
    { label: 'Applied',    count: total,      pct: 100 },
    { label: 'Interviews', count: interviews,  pct: interviewRate },
    { label: 'Offers',     count: offers,      pct: successRate },
    { label: 'Accepted',   count: accepted,    pct: acceptedRate },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Your job search performance at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applied"   value={total}               sub="all time"                   color="text-slate-900 dark:text-white" />
          <StatCard label="Interview Rate"  value={`${interviewRate}%`} sub={`${interviews} interviews`} color="text-slate-900 dark:text-white" />
          <StatCard label="Offer Rate"      value={`${offerRate}%`}     sub={`${offers} offers`}         color="text-slate-900 dark:text-white" />
          <StatCard label="Overall Success" value={`${successRate}%`}   sub={`${rejected} rejections`}   color="text-slate-900 dark:text-white" />
        </div>

        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-5">Application Funnel</h3>
          <div className="flex items-end gap-2 h-36">
            {funnelSteps.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{step.count}</span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${FUNNEL_COLORS[i]}`}
                  style={{ height: `${Math.max(step.pct * 1.2, 12)}px` }}
                  role="img"
                  aria-label={`${step.label}: ${step.count} (${step.pct}%)`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">{step.label}</span>
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{step.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Outcome Distribution">
            {statusData.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data yet.</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                      {statusData.map((entry, i) => <Cell key={i} fill={STATUS_FILL[entry.name as AppStatus] ?? '#9ca3af'} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {statusData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[d.name as AppStatus] ?? 'bg-gray-400'}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{d.name}</span>
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Recent Applications">
            <div className="space-y-3">
              {recentApplications.slice(0, 5).map(app => {
                const friendlyStatus = FROM_BACKEND[app.status] ?? (app.status as AppStatus);
                return (
                  <div key={app.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{app.jobTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{app.company}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[friendlyStatus] ?? 'bg-slate-100 text-slate-800'}`}>
                      {friendlyStatus}
                    </span>
                  </div>
                );
              })}
              {recentApplications.length === 0 && (
                <p className="text-sm text-gray-500">No applications yet.</p>
              )}
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}
