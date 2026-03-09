import React from 'react';
import { Link } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

// ── Types inlined to avoid cross-file casing import issues ────────────────────
export type AppStatus =
  | 'Applied'
  | 'Interview Scheduled'
  | 'Interview Done'
  | 'Offer Received'
  | 'Offer Accepted'
  | 'Rejected'
  | 'Withdrawn';

interface Application {
  id: string; jobTitle: string; company: string; logo: string;
  location: string; salary: string; appliedDate: string;
  status: AppStatus; notes: string;
}

const SAMPLE_APPS: Application[] = [
  { id: '1',  jobTitle: 'Senior Frontend Developer', company: 'TechCorp Inc.',  logo: '🚀', location: 'San Francisco, CA', salary: '$120k–$150k', appliedDate: '2025-01-10', status: 'Interview Done',      notes: '' },
  { id: '2',  jobTitle: 'React Developer',           company: 'StartupXYZ',     logo: '💡', location: 'Remote',            salary: '$100k–$130k', appliedDate: '2025-01-14', status: 'Offer Received',      notes: '' },
  { id: '3',  jobTitle: 'Full Stack Engineer',        company: 'InnovateLabs',   logo: '🎯', location: 'New York, NY',      salary: '$110k–$140k', appliedDate: '2025-01-18', status: 'Applied',             notes: '' },
  { id: '4',  jobTitle: 'UI/UX Designer',             company: 'DesignHub',      logo: '🎨', location: 'Los Angeles, CA',   salary: '$90k–$120k',  appliedDate: '2025-01-20', status: 'Rejected',            notes: '' },
  { id: '5',  jobTitle: 'Backend Developer',          company: 'CloudSystems',   logo: '☁️', location: 'Seattle, WA',       salary: '$115k–$145k', appliedDate: '2025-02-03', status: 'Interview Scheduled', notes: '' },
  { id: '6',  jobTitle: 'DevOps Engineer',            company: 'InfraTech',      logo: '⚙️', location: 'Austin, TX',        salary: '$125k–$155k', appliedDate: '2025-02-05', status: 'Withdrawn',           notes: '' },
  { id: '7',  jobTitle: 'Mobile App Developer',       company: 'AppStudio',      logo: '📱', location: 'Remote',            salary: '$80k–$110k',  appliedDate: '2025-02-10', status: 'Applied',             notes: '' },
  { id: '8',  jobTitle: 'Data Scientist',             company: 'DataWorks',      logo: '📊', location: 'Boston, MA',        salary: '$130k–$160k', appliedDate: '2025-02-15', status: 'Interview Done',      notes: '' },
  { id: '9',  jobTitle: 'Product Manager',            company: 'ProductCo',      logo: '📋', location: 'Chicago, IL',       salary: '$105k–$135k', appliedDate: '2025-02-20', status: 'Offer Accepted',      notes: '' },
  { id: '10', jobTitle: 'QA Engineer',                company: 'QualityFirst',   logo: '✅', location: 'Denver, CO',        salary: '$85k–$110k',  appliedDate: '2025-02-25', status: 'Rejected',            notes: '' },
  { id: '11', jobTitle: 'Cloud Architect',            company: 'SkyTech',        logo: '🌤️', location: 'Remote',            salary: '$150k–$180k', appliedDate: '2025-03-01', status: 'Interview Scheduled', notes: '' },
  { id: '12', jobTitle: 'ML Engineer',                company: 'AILabs',         logo: '🤖', location: 'San Francisco, CA', salary: '$140k–$170k', appliedDate: '2025-03-05', status: 'Applied',             notes: '' },
];

// Recharts needs hex fills — kept only for chart Cell props (not DOM style attrs)
const STATUS_FILL: Record<AppStatus, string> = {
  'Applied':             '#60a5fa',
  'Interview Scheduled': '#a78bfa',
  'Interview Done':      '#818cf8',
  'Offer Received':      '#fbbf24',
  'Offer Accepted':      '#34d399',
  'Rejected':            '#f87171',
  'Withdrawn':           '#9ca3af',
};

// Tailwind classes for DOM elements — no inline styles
const STATUS_BADGE: Record<AppStatus, string> = {
  'Applied':             'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Interview Scheduled': 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300',
  'Interview Done':      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
  'Offer Received':      'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  'Offer Accepted':      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  'Rejected':            'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  'Withdrawn':           'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const STATUS_DOT: Record<AppStatus, string> = {
  'Applied':             'bg-blue-400',
  'Interview Scheduled': 'bg-violet-400',
  'Interview Done':      'bg-indigo-400',
  'Offer Received':      'bg-amber-400',
  'Offer Accepted':      'bg-green-400',
  'Rejected':            'bg-red-400',
  'Withdrawn':           'bg-gray-400',
};

const FUNNEL_COLORS = ['bg-indigo-400', 'bg-violet-400', 'bg-green-400', 'bg-amber-400'];

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
  const apps = SAMPLE_APPS;

  const total      = apps.length;
  const interviews = apps.filter(a => ['Interview Scheduled', 'Interview Done'].includes(a.status)).length;
  const offers     = apps.filter(a => ['Offer Received', 'Offer Accepted'].includes(a.status)).length;
  const accepted   = apps.filter(a => a.status === 'Offer Accepted').length;
  const rejected   = apps.filter(a => a.status === 'Rejected').length;

  const interviewRate = total > 0      ? Math.round((interviews / total)      * 100) : 0;
  const offerRate     = interviews > 0 ? Math.round((offers     / interviews) * 100) : 0;
  const successRate   = total > 0      ? Math.round((offers     / total)      * 100) : 0;
  const acceptedRate  = total > 0      ? Math.round((accepted   / total)      * 100) : 0;

  const statusData = Object.entries(
    apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const monthlyMap = apps.reduce((acc, a) => {
    const month = new Date(a.appliedDate).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) acc[month] = { month, Applied: 0, Interviews: 0, Offers: 0 };
    acc[month].Applied++;
    if (['Interview Scheduled', 'Interview Done'].includes(a.status)) acc[month].Interviews++;
    if (['Offer Received', 'Offer Accepted'].includes(a.status)) acc[month].Offers++;
    return acc;
  }, {} as Record<string, { month: string; Applied: number; Interviews: number; Offers: number }>);
  const lineData = Object.values(monthlyMap);

  const barData = statusData.map(d => ({ ...d, fill: STATUS_FILL[d.name as AppStatus] ?? '#9ca3af' }));

  const funnelSteps = [
    { label: 'Applied',    count: total,      pct: 100 },
    { label: 'Interviews', count: interviews, pct: interviewRate },
    { label: 'Offers',     count: offers,     pct: successRate },
    { label: 'Accepted',   count: accepted,   pct: acceptedRate },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Your job search performance at a glance</p>
          </div>
          <Link to="/tracker" className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Tracker
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applied"   value={total}               sub="all time"                   color="text-gray-900 dark:text-white" />
          <StatCard label="Interview Rate"  value={`${interviewRate}%`} sub={`${interviews} interviews`} color="text-violet-600 dark:text-violet-400" />
          <StatCard label="Offer Rate"      value={`${offerRate}%`}     sub={`${offers} offers`}         color="text-green-600 dark:text-green-400" />
          <StatCard label="Overall Success" value={`${successRate}%`}   sub={`${rejected} rejections`}   color="text-blue-600 dark:text-blue-400" />
        </div>

        {/* Funnel — dynamic height via inline style only on non-DOM recharts elements */}
        <div className="bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-gray-700/60 rounded-2xl p-5 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-5">Application Funnel</h3>
          <div className="flex items-end gap-2 h-36">
            {funnelSteps.map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{step.count}</span>
                {/* height is purely dynamic numeric data — unavoidable inline style */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Monthly Activity">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Applied"    stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Interviews" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Offers"     stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Status Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Outcome Distribution">
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
          </ChartCard>

          <ChartCard title="Recent Applications">
            <div className="space-y-3">
              {apps.slice(-5).reverse().map(app => (
                <div key={app.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                    {app.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{app.jobTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.company}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

      </div>
    </div>
  );
}